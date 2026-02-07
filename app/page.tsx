import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Sparkles, Users, PieChart, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SplitMint
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Split Expenses
            <br />
            The Smart Way
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Track shared expenses, settle balances, and use AI to make splitting bills effortless
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Start Splitting for Free
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              Easy Group Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create groups, add participants, and track expenses for any occasion
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              AI-Powered Parsing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Describe expenses naturally and let AI structure them for you
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              Smart Settlements
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get minimal settlement suggestions and clear balance visualizations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
