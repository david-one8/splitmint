// Build version 4.0 - Fully type-safe expense routes
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ExpenseRequest {
  group_id?: string;
  id?: string;
  description: string;
  amount: number | string;
  payer_id: string;
  date: string;
  split_mode: 'equal' | 'percentage' | 'custom';
  splits?: Record<string, number | string>;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as ExpenseRequest;
  const { group_id, description, amount, payer_id, date, split_mode, splits = {} } = body;

  const totalAmount = Number(amount) || 0;

  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      group_id,
      description,
      amount: totalAmount,
      payer_id,
      date,
      split_mode,
      created_by: user.id,
    })
    .select()
    .single();

  if (expenseError) {
    return NextResponse.json({ error: expenseError.message }, { status: 500 });
  }

  const splitRecords = Object.entries(splits).map(([participant_id, splitAmount]) => {
    const amountNum = Number(splitAmount) || 0;

    return {
      expense_id: expense.id,
      participant_id,
      amount: amountNum,
      percentage:
        split_mode === 'percentage' && totalAmount > 0
          ? (amountNum / totalAmount) * 100
          : null,
    };
  });

  if (splitRecords.length > 0) {
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splitRecords);

    if (splitsError) {
      await supabase.from('expenses').delete().eq('id', expense.id);
      return NextResponse.json({ error: splitsError.message }, { status: 500 });
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
  const { id, description, amount, payer_id, date, split_mode, splits = {} } = body;

  const totalAmount = Number(amount) || 0;

  const { error: expenseError } = await supabase
    .from('expenses')
    .update({
      description,
      amount: totalAmount,
      payer_id,
      date,
      split_mode,
    })
    .eq('id', id);

  if (expenseError) {
    return NextResponse.json({ error: expenseError.message }, { status: 500 });
  }

  await supabase.from('expense_splits').delete().eq('expense_id', id);

  const splitRecords = Object.entries(splits).map(([participant_id, splitAmount]) => {
    const amountNum = Number(splitAmount) || 0;

    return {
      expense_id: id,
      participant_id,
      amount: amountNum,
      percentage:
        split_mode === 'percentage' && totalAmount > 0
          ? (amountNum / totalAmount) * 100
          : null,
    };
  });

  if (splitRecords.length > 0) {
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splitRecords);

    if (splitsError) {
      return NextResponse.json({ error: splitsError.message }, { status: 500 });
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
