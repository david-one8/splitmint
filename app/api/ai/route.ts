import { NextRequest, NextResponse } from 'next/server';
import { parseExpenseFromText } from '@/lib/ai/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { action, text, groupId } = await request.json();

    if (action === 'parseExpense') {
      const supabase = await createClient();
      
      const { data: participantData } = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', groupId);

      if (!participantData || participantData.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'No participants found for this group' 
        });
      }

      const participantNames = participantData.map(p => p.name);
      const result = await parseExpenseFromText(text, participantNames);

      if (result) {
        const payer = participantData?.find(p => 
          result.description.toLowerCase().includes(p.name.toLowerCase())
        );
        
        return NextResponse.json({
          success: true,
          expense: {
            description: result.description,
            amount: result.amount,
            date: result.date,
            payer_id: payer?.id || participantData[0].id,
            participants: result.participants || participantNames,
            split_mode: result.splitMode || 'equal',
          },
        });
      }

      return NextResponse.json({ 
        success: false, 
        error: 'Could not parse expense. Please try again or add manually.' 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process request' 
    }, { status: 500 });
  }
}
