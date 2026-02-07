'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Expense } from '@/lib/types';

export function useExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, payer:participants!expenses_payer_id_fkey(*), splits:expense_splits(*, participant:participants(*))')
      .eq('group_id', groupId)
      .order('date', { ascending: false });

    if (!error && data) {
      setExpenses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (groupId) {
      fetchExpenses();
    }
  }, [groupId]);

  return { expenses, loading, refetch: fetchExpenses };
}
