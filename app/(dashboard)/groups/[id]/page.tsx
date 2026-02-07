'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Group, Participant, Expense } from '@/lib/types';
import { BalanceEngine } from '@/lib/balance-engine';
import {Button} from '@/components/ui/Button';
import BackButton from '@/components/ui/BackButton';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import ParticipantManager from '@/components/groups/ParticipantManager';
import ExpenseForm from '@/components/dashboard/ExpenseForm';
import ExpenseList from '@/components/dashboard/ExpenseList';
import BalanceTable from '@/components/dashboard/BalanceTable';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SearchFilters from '@/components/dashboard/SearchFilters';
import AIAssistant from '@/components/AIAssistant';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (id === 'new') {
      router.replace('/groups/new');
      return;
    }
    fetchGroupData();
  }, [id]);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const fetchGroupData = async () => {
    if (id === 'new') return;

    const { data: groupData } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    const { data: participantsData } = await supabase
      .from('participants')
      .select('*')
      .eq('group_id', id);

    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*, payer:participants!expenses_payer_id_fkey(*), splits:expense_splits(*, participant:participants(*))')
      .eq('group_id', id)
      .order('date', { ascending: false });

    if (groupData) setGroup(groupData);
    if (participantsData) setParticipants(participantsData);
    if (expensesData) setExpenses(expensesData);
    setLoading(false);
  };

  const handleAddParticipant = async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('participants')
      .insert({ group_id: id, name, color })
      .select()
      .single();

    if (!error && data) {
      setParticipants([...participants, data]);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    const hasExpenses = expenses.some(
      e => e.payer_id === participantId || e.splits?.some(s => s.participant_id === participantId)
    );

    if (hasExpenses) {
      alert('Cannot remove participant with linked expenses');
      return;
    }

    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    if (!error) {
      setParticipants(participants.filter(p => p.id !== participantId));
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expenseData, group_id: id }),
    });

    if (response.ok) {
      setIsExpenseModalOpen(false);
      fetchGroupData();
    }
  };

  const handleEditExpense = async (expenseData: any) => {
    if (!editingExpense) return;

    const response = await fetch('/api/expenses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expenseData, id: editingExpense.id }),
    });

    if (response.ok) {
      setIsExpenseModalOpen(false);
      setEditingExpense(null);
      fetchGroupData();
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    const response = await fetch(`/api/expenses?id=${expenseId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchGroupData();
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;

    const response = await fetch(`/api/groups?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.push('/dashboard');
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...expenses];

    if (filters.search) {
      filtered = filtered.filter(e =>
        e.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.participant) {
      filtered = filtered.filter(
        e => e.payer_id === filters.participant || 
        e.splits?.some(s => s.participant_id === filters.participant)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(e => e.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(e => e.date <= filters.dateTo);
    }

    setFilteredExpenses(filtered);
  };

  const handleAIExpenseParsed = (expenseData: any) => {
    setEditingExpense(null);
    handleAddExpense(expenseData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Group not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This group doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const balanceEngine = new BalanceEngine(participants, expenses);
  const balances = balanceEngine.getBalances();
  const settlements = balanceEngine.getSettlements();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOwed = balances.reduce((sum, b) => sum + (b.netBalance < 0 ? Math.abs(b.netBalance) : 0), 0);
  const totalOwedToYou = balances.reduce((sum, b) => sum + (b.netBalance > 0 ? b.netBalance : 0), 0);

  return (
    <div className="space-y-6">
      {/* Updated Header with Back Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <BackButton href="/dashboard" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {group.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {participants.length} participant{participants.length !== 1 ? 's' : ''} • {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setIsParticipantModalOpen(true)}
            className="text-xs sm:text-sm"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Manage</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
            className="text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={handleDeleteGroup}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {participants.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Add participants to get started
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to add at least one participant to start tracking expenses
            </p>
            <Button onClick={() => setIsParticipantModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Participants
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <SummaryCards
            totalSpent={totalSpent}
            totalOwed={totalOwed}
            totalOwedToYou={totalOwedToYou}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AIAssistant
                groupId={id}
                participants={participants.map(p => p.name)}
                onExpenseParsed={handleAIExpenseParsed}
              />

              <SearchFilters
                participants={participants}
                onFilterChange={handleFilterChange}
              />

              <ExpenseList
                expenses={filteredExpenses}
                participants={participants}
                onEdit={(expense) => {
                  setEditingExpense(expense);
                  setIsExpenseModalOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </div>

            <div className="space-y-6">
              <BalanceTable balances={balances} />

              {settlements.length > 0 && (
                <Card>
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Settlement Suggestions
                  </h2>
                  <div className="space-y-3">
                    {settlements.map((settlement, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          <span className="font-bold">{settlement.from}</span> pays{' '}
                          <span className="font-bold">{settlement.to}</span>
                        </p>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                          {formatCurrency(settlement.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          participants={participants}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onCancel={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          editExpense={editingExpense}
        />
      </Modal>

      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Manage Participants"
      >
        <ParticipantManager
          participants={participants}
          onAdd={handleAddParticipant}
          onRemove={handleRemoveParticipant}
        />
      </Modal>
    </div>
  );
}
