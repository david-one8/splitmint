import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, LogOut, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SplitMint
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/groups">
                <Button variant="ghost" size="sm">
                  <Users className="w-5 h-5 mr-2" />
                  Groups
                </Button>
              </Link>
              <ThemeToggle />
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
