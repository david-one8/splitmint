'use client';

import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  totalSpent: number;
  totalOwed: number;
  totalOwedToYou: number;
}

export default function SummaryCards({ totalSpent, totalOwed, totalOwedToYou }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Spent</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-80" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">You Owe</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalOwed)}</p>
          </div>
          <TrendingDown className="w-12 h-12 opacity-80" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Owed to You</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalOwedToYou)}</p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
      </Card>
    </div>
  );
}
