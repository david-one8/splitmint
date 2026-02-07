import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { group_id, description, amount, payer_id, date, split_mode, splits } = await request.json();

  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      group_id,
      description,
      amount,
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
    const amountValue = typeof splitAmount === 'number' ? splitAmount : parseFloat(String(splitAmount));
    
    return {
      expense_id: expense.id,
      participant_id,
      amount: amountValue,
      percentage: split_mode === 'percentage' ? (amountValue / expense.amount) * 100 : null,
    };
  });

  const { error: splitsError } = await supabase
    .from('expense_splits')
    .insert(splitRecords);

  if (splitsError) {
    await supabase.from('expenses').delete().eq('id', expense.id);
    return NextResponse.json({ error: splitsError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, expense });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, description, amount, payer_id, date, split_mode, splits } = await request.json();

  const { error: expenseError } = await supabase
    .from('expenses')
    .update({ description, amount, payer_id, date, split_mode })
    .eq('id', id);

  if (expenseError) {
    return NextResponse.json({ error: expenseError.message }, { status: 500 });
  }

  await supabase.from('expense_splits').delete().eq('expense_id', id);

  const splitRecords = Object.entries(splits).map(([participant_id, splitAmount]) => {
    const amountValue = typeof splitAmount === 'number' ? splitAmount : parseFloat(String(splitAmount));
    
    return {
      expense_id: id,
      participant_id,
      amount: amountValue,
      percentage: split_mode === 'percentage' ? (amountValue / amount) * 100 : null,
    };
  });

  const { error: splitsError } = await supabase
    .from('expense_splits')
    .insert(splitRecords);

  if (splitsError) {
    return NextResponse.json({ error: splitsError.message }, { status: 500 });
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

  const { error } = await supabase.from('expenses').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
