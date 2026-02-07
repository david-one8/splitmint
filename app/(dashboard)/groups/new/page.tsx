'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BackButton from '@/components/ui/BackButton';
import ParticipantManager from '@/components/groups/ParticipantManager';

interface TempParticipant {
  id: string;
  name: string;
  color: string;
}

export default function NewGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<TempParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAddParticipant = (name: string, color: string) => {
    const newParticipant: TempParticipant = {
      id: `temp-${Date.now()}`,
      name,
      color,
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (participants.length === 0) {
      setError('Add at least one participant');
      return;
    }

    if (participants.length > 4) {
      setError('Maximum 4 participants allowed (including you)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({ name: groupName, owner_id: user.id })
        .select()
        .single();

      if (groupError) throw groupError;

      const participantRecords = participants.map(p => ({
        group_id: group.id,
        name: p.name,
        color: p.color,
      }));

      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantRecords);

      if (participantsError) {
        await supabase.from('groups').delete().eq('id', group.id);
        throw participantsError;
      }

      router.push(`/groups/${group.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <BackButton href="/dashboard" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Group</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add up to 3 participants plus yourself
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <Input
            type="text"
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Goa Trip, Roommates, Office Team"
            required
            autoFocus
          />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <ParticipantManager
              participants={participants as any}
              maxParticipants={3}
              onAdd={handleAddParticipant}
              onRemove={handleRemoveParticipant}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
