'use client';

import { Expense, Participant } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import { Edit2, Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  participants: Participant[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

export default function ExpenseList({ expenses, participants, onEdit, onDelete }: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant?.name || 'Unknown';
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Expenses</h2>
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No expenses yet. Add your first expense!
          </p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {expense.description}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Paid by {getParticipantName(expense.payer_id)} • {formatDate(expense.date)} •{' '}
                  {expense.split_mode} split
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense)}
                    aria-label="Edit expense"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    aria-label="Delete expense"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
