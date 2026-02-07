import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GroupCard from '@/components/groups/GroupCard';
import { Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: groups } = await supabase
    .from('groups')
    .select('*, participants(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your expense groups
          </p>
        </div>
        <Link href="/groups/new">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Group
          </Button>
        </Link>
      </div>

      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            No groups yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first group to start tracking expenses
          </p>
          <Link href="/groups/new">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Create First Group
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
