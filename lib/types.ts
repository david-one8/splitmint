export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  participants?: Participant[];
}

export interface Participant {
  id: string;
  group_id: string;
  name: string;
  color: string;
  avatar: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  payer_id: string;
  date: string;
  split_mode: 'equal' | 'custom' | 'percentage';
  created_by: string;
  created_at: string;
  updated_at: string;
  payer?: Participant;
  splits?: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  participant_id: string;
  amount: number;
  percentage: number | null;
  participant?: Participant;
}

export interface Balance {
  participantId: string;
  participantName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface AIExpenseInput {
  description: string;
  amount?: number;
  date?: string;
  participants?: string[];
  splitMode?: 'equal' | 'custom' | 'percentage';
}
