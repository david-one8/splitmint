import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIExpenseInput } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseExpenseFromText(text: string, groupParticipants: string[]): Promise<AIExpenseInput | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are an expense parser for a bill splitting app. Parse the following expense statement and extract structured data.

Available participants: ${groupParticipants.join(', ')}

Input: "${text}"

Extract:
1. Description of the expense
2. Amount (number only, no currency symbols)
3. Date (YYYY-MM-DD format, today if not mentioned: ${new Date().toISOString().split('T')[0]})
4. Who paid (must match one of the participants exactly)
5. Split mode: equal, custom, or percentage
6. If custom/percentage, include split details

Respond ONLY with valid JSON in this exact format:
{
  "description": "string",
  "amount": number,
  "date": "YYYY-MM-DD",
  "payer": "exact participant name",
  "splitMode": "equal|custom|percentage",
  "participants": ["participant1", "participant2"],
  "customAmounts": {"participant1": amount, "participant2": amount},
  "percentages": {"participant1": percentage, "participant2": percentage}
}

If you cannot parse the expense, return: {"error": "Unable to parse expense"}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (parsed.error) return null;

    return {
      description: parsed.description,
      amount: parsed.amount,
      date: parsed.date,
      participants: parsed.participants || groupParticipants,
      splitMode: parsed.splitMode || 'equal',
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return null;
  }
}

export async function generateGroupSummary(groupName: string, expenses: any[], balances: any[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Generate a friendly summary for expense group "${groupName}".

Expenses: ${JSON.stringify(expenses)}
Balances: ${JSON.stringify(balances)}

Create a 2-3 sentence natural language summary highlighting:
- Total spending
- Who spent the most
- Who owes the most
- Any interesting patterns

Keep it conversational and helpful.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'Unable to generate summary at this time.';
  }
}

export async function suggestSettlement(settlements: any[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Given these settlements: ${JSON.stringify(settlements)}

Generate a friendly, actionable message suggesting how to settle up. Make it natural and encouraging.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'Please settle your balances as shown above.';
  }
}
