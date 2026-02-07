'use client';

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import Input from './ui/Input';
import {Button} from './ui/Button';
import Card from './ui/Card';

interface AIAssistantProps {
  groupId: string;
  participants: string[];
  onExpenseParsed: (expenseData: any) => void;
}

export default function AIAssistant({ groupId, participants, onExpenseParsed }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parseExpense',
          text: input,
          groupId,
          participants,
        }),
      });

      const data = await response.json();

      if (data.success && data.expense) {
        setResult('✅ Expense parsed successfully!');
        onExpenseParsed(data.expense);
        setInput('');
      } else {
        setResult('⚠️⚠️⚠️ Free Quota of Gemini API exceeded. Please add manually.');
      }
    } catch (error) {
      setResult('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h3>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Describe your expense in natural language, and I'll help you add it!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., John paid 500 for dinner yesterday, split equally"
          disabled={loading}
        />
        
        <Button type="submit" disabled={loading || !input.trim()} className="w-full">
          {loading ? (
            'Parsing...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Parse Expense
            </>
          )}
        </Button>
      </form>
      
      {result && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          result.startsWith('✅')
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {result}
        </div>
      )}
    </Card>
  );
}
