'use client';

import { useState, useEffect } from 'react';
import { Expense, Participant } from '@/lib/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { BalanceEngine } from '@/lib/balance-engine';

interface ExpenseFormProps {
  participants: Participant[];
  onSubmit: (expenseData: any) => void;
  onCancel: () => void;
  editExpense?: Expense | null;
}

export default function ExpenseForm({ participants, onSubmit, onCancel, editExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState('');
  const [splitMode, setSplitMode] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>({});
  const [percentages, setPercentages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editExpense) {
      setDescription(editExpense.description);
      setAmount(editExpense.amount.toString());
      setDate(editExpense.date);
      setPayerId(editExpense.payer_id);
      setSplitMode(editExpense.split_mode);
      
      const participantIds = editExpense.splits?.map(s => s.participant_id) || [];
      setSelectedParticipants(participantIds);
      
      if (editExpense.split_mode === 'custom') {
        const amounts: { [key: string]: string } = {};
        editExpense.splits?.forEach(s => {
          amounts[s.participant_id] = s.amount.toString();
        });
        setCustomAmounts(amounts);
      } else if (editExpense.split_mode === 'percentage') {
        const percs: { [key: string]: string } = {};
        editExpense.splits?.forEach(s => {
          percs[s.participant_id] = s.percentage?.toString() || '0';
        });
        setPercentages(percs);
      }
    } else {
      setSelectedParticipants(participants.map(p => p.id));
    }
  }, [editExpense, participants]);

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (selectedParticipants.length === 0) {
      alert('Please select at least one participant');
      return;
    }

    let splits: { [key: string]: number } = {};

    if (splitMode === 'equal') {
      splits = BalanceEngine.calculateSplits(amountNum, selectedParticipants, 'equal');
    } else if (splitMode === 'custom') {
      const customAmountsNum: { [key: string]: number } = {};
      let total = 0;
      
      for (const id of selectedParticipants) {
        const amt = parseFloat(customAmounts[id] || '0');
        customAmountsNum[id] = amt;
        total += amt;
      }
      
      if (Math.abs(total - amountNum) > 0.01) {
        alert(`Custom amounts must sum to ${amountNum}. Current sum: ${total}`);
        return;
      }
      
      splits = customAmountsNum;
    } else if (splitMode === 'percentage') {
      const percentagesNum: { [key: string]: number } = {};
      let total = 0;
      
      for (const id of selectedParticipants) {
        const perc = parseFloat(percentages[id] || '0');
        percentagesNum[id] = perc;
        total += perc;
      }
      
      if (Math.abs(total - 100) > 0.01) {
        alert(`Percentages must sum to 100%. Current sum: ${total}%`);
        return;
      }
      
      splits = BalanceEngine.calculateSplits(amountNum, selectedParticipants, 'percentage', undefined, percentagesNum);
    }

    onSubmit({
      description,
      amount: amountNum,
      date,
      payer_id: payerId,
      split_mode: splitMode,
      splits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Dinner, groceries, etc."
        required
      />
      
      <Input
        type="number"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
      />
      
      <Input
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      
      <Select
        label="Paid By"
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        options={[
          { value: '', label: 'Select payer' },
          ...participants.map(p => ({ value: p.id, label: p.name }))
        ]}
        required
      />
      
      <Select
        label="Split Mode"
        value={splitMode}
        onChange={(e) => setSplitMode(e.target.value as 'equal' | 'custom' | 'percentage')}
        options={[
          { value: 'equal', label: 'Equal Split' },
          { value: 'custom', label: 'Custom Amount' },
          { value: 'percentage', label: 'Percentage' },
        ]}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Participants
        </label>
        <div className="space-y-2">
          {participants.map(participant => (
            <label key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={selectedParticipants.includes(participant.id)}
                onChange={() => handleParticipantToggle(participant.id)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: participant.color }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {participant.name}
                </span>
              </div>
              
              {splitMode === 'custom' && selectedParticipants.includes(participant.id) && (
                <Input
                  type="number"
                  value={customAmounts[participant.id] || ''}
                  onChange={(e) => setCustomAmounts({ ...customAmounts, [participant.id]: e.target.value })}
                  placeholder="Amount"
                  step="0.01"
                  className="w-24"
                />
              )}
              
              {splitMode === 'percentage' && selectedParticipants.includes(participant.id) && (
                <Input
                  type="number"
                  value={percentages[participant.id] || ''}
                  onChange={(e) => setPercentages({ ...percentages, [participant.id]: e.target.value })}
                  placeholder="%"
                  step="0.01"
                  className="w-20"
                />
              )}
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {editExpense ? 'Update' : 'Add'} Expense
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
