'use client';

import { Balance } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface BalanceTableProps {
  balances: Balance[];
}

export default function BalanceTable({ balances }: BalanceTableProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Balances</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Participant
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Paid
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Share
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => (
              <tr
                key={balance.participantId}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  {balance.participantName}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                  {formatCurrency(balance.totalPaid)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                  {formatCurrency(balance.totalOwed)}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-semibold ${
                  balance.netBalance > 0
                    ? 'text-green-600 dark:text-green-400'
                    : balance.netBalance < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {formatCurrency(Math.abs(balance.netBalance))}
                  {balance.netBalance !== 0 && (
                    <span className="text-xs ml-1">
                      {balance.netBalance > 0 ? '↑' : '↓'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
