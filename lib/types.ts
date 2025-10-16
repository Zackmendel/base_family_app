export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
  createdAt: Date;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  userId: string;
  familyId: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  familyId: string;
}

export type Theme = "light" | "dark" | "system";
