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

export type MemberRole = "parent" | "child" | "guardian";

export type PermissionLevel = "full" | "limited" | "view-only";

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  age?: number;
  avatar?: string;
  createdAt: Date;
}

export interface SubAccount {
  id: string;
  memberId: string;
  balance: number;
  spendLimit: number;
  spendPeriod: "daily" | "weekly" | "monthly";
  permissions: PermissionLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  subAccountId: string;
  memberId: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  description: string;
  merchant?: string;
  status: "pending" | "completed" | "declined";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SpendLimit {
  subAccountId: string;
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
  categoryLimits?: Record<string, number>;
}

export interface Permission {
  subAccountId: string;
  canTransfer: boolean;
  canViewFamily: boolean;
  canRequestFunds: boolean;
  requiresApproval: boolean;
  approvalThreshold?: number;
}
