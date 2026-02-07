'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGroups } from '@/hooks/useGroups';
import Button from '@/components/ui/Button';
import GroupCard from '@/components/groups/GroupCard';
import { Plus } from 'lucide-react';

export default function GroupsPage() {
  const { groups, loading } = useGroups();
  const router = useRouter();

  if (loading) {
    return <div className="text-center py-16 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
        <Button onClick={() => router.push('/groups/new')}>
          <Plus className="w-5 h-5 mr-2" />
          New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            No groups yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first group to start tracking expenses
          </p>
          <Button onClick={() => router.push('/groups/new')}>
            <Plus className="w-5 h-5 mr-2" />
            Create First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
