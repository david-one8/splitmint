'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGroups } from '@/hooks/useGroups';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import GroupForm from '@/components/groups/GroupForm';
import GroupCard from '@/components/groups/GroupCard';
import { Plus } from 'lucide-react';

export default function GroupsPage() {
  const { groups, loading, refetch } = useGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreateGroup = async (groupName: string) => {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName }),
    });

    if (response.ok) {
      const { group } = await response.json();
      setIsModalOpen(false);
      router.push(`/groups/${group.id}`);
      refetch();
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Group"
      >
        <GroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
