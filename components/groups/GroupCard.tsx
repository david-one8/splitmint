'use client';

import { Group } from '@/lib/types';
import Card from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import { Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const router = useRouter();

  return (
    <Card className="hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push(`/groups/${group.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{group.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {group.participants?.length || 0} participants
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      
      {group.participants && group.participants.length > 0 && (
        <div className="flex -space-x-2">
          {group.participants.slice(0, 4).map(participant => (
            <div
              key={participant.id}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: participant.color }}
              title={participant.name}
            >
              {participant.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {group.participants.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
              +{group.participants.length - 4}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
