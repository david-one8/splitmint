'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import {Button} from '@/components/ui/Button';

interface GroupFormProps {
  onSubmit: (groupName: string) => void;
  onCancel: () => void;
}

export default function GroupForm({ onSubmit, onCancel }: GroupFormProps) {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onSubmit(groupName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="e.g., Goa Trip, Roommates, Office Team"
        required
        autoFocus
      />
      
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          Create Group
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
