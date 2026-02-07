import RegisterForm from '@/components/auth/RegisterForm';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SplitMint
          </span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start splitting expenses today</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
