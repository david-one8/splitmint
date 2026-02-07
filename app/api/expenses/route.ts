// Build version 5.0 - Fully safe expense routes
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ExpenseRequest {
  group_id?: string;
  id?: string;
  description?: string;
  amount?: number | string;
  payer_id?: string;
  date?: string;
  split_mode?: 'equal' | 'percentage' | 'custom';
  splits?: Record<string, number | string>;
}

function parseNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as ExpenseRequest;

  const totalAmount = parseNumber(body.amount);
  const splits = body.splits ?? {};

  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      group_id: body.group_id,
      description: body.description,
      amount: totalAmount,
      payer_id: body.payer_id,
      date: body.date,
      split_mode: body.split_mode,
      created_by: user.id,
    })
    .select()
    .single();

  if (expenseError) {
    return NextResponse.json({ error: expenseError.message }, { status: 500 });
  }

  const splitRecords = Object.entries(splits).map(([participant_id, value]) => {
    const amountNum = parseNumber(value);

    return {
      expense_id: expense.id,
      participant_id,
      amount: amountNum,
      percentage:
        body.split_mode === 'percentage' && totalAmount > 0
          ? (amountNum / totalAmount) * 100
          : null,
    };
  });

  if (splitRecords.length) {
    const { error } = await supabase
      .from('expense_splits')
      .insert(splitRecords);

    if (error) {
      await supabase.from('expenses').delete().eq('id', expense.id);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, expense });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as ExpenseRequest;

  const totalAmount = parseNumber(body.amount);
  const splits = body.splits ?? {};

  const { error: expenseError } = await supabase
    .from('expenses')
    .update({
      description: body.description,
      amount: totalAmount,
      payer_id: body.payer_id,
      date: body.date,
      split_mode: body.split_mode,
    })
    .eq('id', body.id);

  if (expenseError) {
    return NextResponse.json({ error: expenseError.message }, { status: 500 });
  }

  await supabase.from('expense_splits').delete().eq('expense_id', body.id);

  const splitRecords = Object.entries(splits).map(([participant_id, value]) => {
    const amountNum = parseNumber(value);

    return {
      expense_id: body.id,
      participant_id,
      amount: amountNum,
      percentage:
        body.split_mode === 'percentage' && totalAmount > 0
          ? (amountNum / totalAmount) * 100
          : null,
    };
  });

  if (splitRecords.length) {
    const { error } = await supabase
      .from('expense_splits')
      .insert(splitRecords);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
