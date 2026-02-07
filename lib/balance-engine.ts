import { Expense, ExpenseSplit, Participant, Balance, Settlement } from './types';
import { roundAmount } from './utils';

export class BalanceEngine {
  private balances: Map<string, Balance> = new Map();

  constructor(private participants: Participant[], private expenses: Expense[]) {
    this.initializeBalances();
    this.calculateBalances();
  }

  private initializeBalances() {
    this.participants.forEach(participant => {
      this.balances.set(participant.id, {
        participantId: participant.id,
        participantName: participant.name,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      });
    });
  }

  private calculateBalances() {
    this.expenses.forEach(expense => {
      const paidBy = this.balances.get(expense.payer_id);
      if (paidBy) {
        paidBy.totalPaid += expense.amount;
      }

      expense.splits?.forEach(split => {
        const participant = this.balances.get(split.participant_id);
        if (participant) {
          participant.totalOwed += split.amount;
        }
      });
    });

    this.balances.forEach(balance => {
      balance.netBalance = roundAmount(balance.totalPaid - balance.totalOwed);
    });
  }

  public getBalances(): Balance[] {
    return Array.from(this.balances.values());
  }

  public getBalance(participantId: string): Balance | undefined {
    return this.balances.get(participantId);
  }

  public getSettlements(): Settlement[] {
    const settlements: Settlement[] = [];
    const balances = Array.from(this.balances.values());
    
    const debtors = balances.filter(b => b.netBalance < 0).map(b => ({ ...b }));
    const creditors = balances.filter(b => b.netBalance > 0).map(b => ({ ...b }));

    debtors.sort((a, b) => a.netBalance - b.netBalance);
    creditors.sort((a, b) => b.netBalance - a.netBalance);

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(Math.abs(debtor.netBalance), creditor.netBalance);

      if (amount > 0.01) {
        settlements.push({
          from: debtor.participantName,
          to: creditor.participantName,
          amount: roundAmount(amount),
        });
      }

      debtor.netBalance += amount;
      creditor.netBalance -= amount;

      if (Math.abs(debtor.netBalance) < 0.01) i++;
      if (Math.abs(creditor.netBalance) < 0.01) j++;
    }

    return settlements;
  }

  public static calculateSplits(
    amount: number,
    participants: string[],
    splitMode: 'equal' | 'custom' | 'percentage',
    customAmounts?: { [key: string]: number },
    percentages?: { [key: string]: number }
  ): { [key: string]: number } {
    const splits: { [key: string]: number } = {};

    if (splitMode === 'equal') {
      const perPerson = amount / participants.length;
      const rounded = roundAmount(perPerson);
      const total = rounded * participants.length;
      const diff = roundAmount(amount - total);

      participants.forEach((id, index) => {
        splits[id] = index === 0 ? roundAmount(rounded + diff) : rounded;
      });
    } else if (splitMode === 'custom' && customAmounts) {
      Object.keys(customAmounts).forEach(id => {
        splits[id] = roundAmount(customAmounts[id]);
      });
    } else if (splitMode === 'percentage' && percentages) {
      let totalAllocated = 0;
      const keys = Object.keys(percentages);
      
      keys.forEach((id, index) => {
        if (index === keys.length - 1) {
          splits[id] = roundAmount(amount - totalAllocated);
        } else {
          const allocated = roundAmount((amount * percentages[id]) / 100);
          splits[id] = allocated;
          totalAllocated += allocated;
        }
      });
    }

    return splits;
  }
}
