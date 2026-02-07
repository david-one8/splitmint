import { NextResponse } from 'next/server';
import { parseExpenseFromText, generateGroupSummary, suggestSettlement } from '@/lib/ai/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, text, groupId, participants, expenses, balances, settlements } = await request.json();

  try {
    if (action === 'parseExpense') {
      const { data: participantData } = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', groupId);

      const participantNames = participantData?.map(p => p.name) || [];
      const result = await parseExpenseFromText(text, participantNames);

      if (result) {
        const payer = participantData?.find(p => p.name === result.payer || result.description.toLowerCase().includes(p.name.toLowerCase()));
        
        return NextResponse.json({
          success: true,
          expense: {
            ...result,
            group_id: groupId,
            payer_id: payer?.id || participantData?.[0]?.id,
          },
        });
      }

      return NextResponse.json({ success: false, error: 'Could not parse expense' });
    }

    if (action === 'generateSummary') {
      const summary = await generateGroupSummary(groupId, expenses, balances);
      return NextResponse.json({ success: true, summary });
    }

    if (action === 'suggestSettlement') {
      const suggestion = await suggestSettlement(settlements);
      return NextResponse.json({ success: true, suggestion });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
