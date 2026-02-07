'use client';

import { useState } from 'react';
import { Participant } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { UserPlus, Trash2 } from 'lucide-react';
import { generateColor } from '@/lib/utils';

interface ParticipantManagerProps {
  participants: Participant[];
  maxParticipants?: number;
  onAdd: (name: string, color: string) => void;
  onRemove: (participantId: string) => void;
}

export default function ParticipantManager({
  participants,
  maxParticipants = 4,
  onAdd,
  onRemove,
}: ParticipantManagerProps) {
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim() && participants.length < maxParticipants) {
      onAdd(newParticipantName.trim(), generateColor());
      setNewParticipantName('');
    }
  };

  const canAddMore = participants.length < maxParticipants;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Participants ({participants.length}/{maxParticipants})
        </h3>
        
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: participant.color }}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {participant.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(participant.id)}
                aria-label="Remove participant"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {canAddMore && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            type="text"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            placeholder="Add participant name"
            className="flex-1"
          />
          <Button type="submit" disabled={!newParticipantName.trim()}>
            <UserPlus className="w-5 h-5" />
          </Button>
        </form>
      )}
      
      {!canAddMore && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Maximum number of participants reached
        </p>
      )}
    </div>
  );
}
