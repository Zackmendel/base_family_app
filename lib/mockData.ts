import type {
  FamilyMember,
  SubAccount,
  Transaction,
  Permission,
} from "./types";

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: "member-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "parent",
    age: 42,
    avatar: "👩‍💼",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "member-2",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "parent",
    age: 44,
    avatar: "👨‍💼",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "member-3",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    role: "child",
    age: 16,
    avatar: "👧",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "member-4",
    name: "Lucas Johnson",
    email: "lucas.johnson@example.com",
    role: "child",
    age: 13,
    avatar: "👦",
    createdAt: new Date("2024-01-15"),
  },
];

export const mockSubAccounts: SubAccount[] = [
  {
    id: "sub-1",
    memberId: "member-1",
    balance: 5000.0,
    spendLimit: 2000.0,
    spendPeriod: "monthly",
    permissions: "full",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-16"),
  },
  {
    id: "sub-2",
    memberId: "member-2",
    balance: 4500.0,
    spendLimit: 2000.0,
    spendPeriod: "monthly",
    permissions: "full",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-16"),
  },
  {
    id: "sub-3",
    memberId: "member-3",
    balance: 350.0,
    spendLimit: 200.0,
    spendPeriod: "weekly",
    permissions: "limited",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-16"),
  },
  {
    id: "sub-4",
    memberId: "member-4",
    balance: 150.0,
    spendLimit: 50.0,
    spendPeriod: "weekly",
    permissions: "view-only",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-16"),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    subAccountId: "sub-3",
    memberId: "member-3",
    amount: 45.99,
    type: "debit",
    category: "shopping",
    description: "New clothes",
    merchant: "Fashion Store",
    status: "completed",
    timestamp: new Date("2024-10-14T14:30:00"),
  },
  {
    id: "txn-2",
    subAccountId: "sub-4",
    memberId: "member-4",
    amount: 12.5,
    type: "debit",
    category: "food",
    description: "School lunch",
    merchant: "School Cafeteria",
    status: "completed",
    timestamp: new Date("2024-10-15T12:15:00"),
  },
  {
    id: "txn-3",
    subAccountId: "sub-3",
    memberId: "member-3",
    amount: 25.0,
    type: "credit",
    category: "allowance",
    description: "Weekly allowance",
    status: "completed",
    timestamp: new Date("2024-10-13T09:00:00"),
  },
  {
    id: "txn-4",
    subAccountId: "sub-1",
    memberId: "member-1",
    amount: 125.75,
    type: "debit",
    category: "groceries",
    description: "Weekly groceries",
    merchant: "Supermarket",
    status: "completed",
    timestamp: new Date("2024-10-15T18:45:00"),
  },
  {
    id: "txn-5",
    subAccountId: "sub-4",
    memberId: "member-4",
    amount: 60.0,
    type: "debit",
    category: "entertainment",
    description: "Video game purchase",
    merchant: "Game Store",
    status: "pending",
    timestamp: new Date("2024-10-16T10:20:00"),
    metadata: {
      requiresApproval: true,
      approvalStatus: "pending",
    },
  },
  {
    id: "txn-6",
    subAccountId: "sub-2",
    memberId: "member-2",
    amount: 89.99,
    type: "debit",
    category: "utilities",
    description: "Internet bill",
    merchant: "ISP Provider",
    status: "completed",
    timestamp: new Date("2024-10-12T08:30:00"),
  },
  {
    id: "txn-7",
    subAccountId: "sub-3",
    memberId: "member-3",
    amount: 15.0,
    type: "debit",
    category: "transportation",
    description: "Bus pass",
    merchant: "Transit Authority",
    status: "completed",
    timestamp: new Date("2024-10-10T07:15:00"),
  },
];

export const mockPermissions: Permission[] = [
  {
    subAccountId: "sub-1",
    canTransfer: true,
    canViewFamily: true,
    canRequestFunds: true,
    requiresApproval: false,
  },
  {
    subAccountId: "sub-2",
    canTransfer: true,
    canViewFamily: true,
    canRequestFunds: true,
    requiresApproval: false,
  },
  {
    subAccountId: "sub-3",
    canTransfer: false,
    canViewFamily: true,
    canRequestFunds: true,
    requiresApproval: true,
    approvalThreshold: 50.0,
  },
  {
    subAccountId: "sub-4",
    canTransfer: false,
    canViewFamily: false,
    canRequestFunds: true,
    requiresApproval: true,
    approvalThreshold: 25.0,
  },
];

export const getMemberById = (id: string): FamilyMember | undefined => {
  return mockFamilyMembers.find((member) => member.id === id);
};

export const getSubAccountById = (id: string): SubAccount | undefined => {
  return mockSubAccounts.find((account) => account.id === id);
};

export const getSubAccountByMemberId = (
  memberId: string
): SubAccount | undefined => {
  return mockSubAccounts.find((account) => account.memberId === memberId);
};

export const getTransactionsBySubAccountId = (
  subAccountId: string
): Transaction[] => {
  return mockTransactions.filter((txn) => txn.subAccountId === subAccountId);
};

export const getPermissionsBySubAccountId = (
  subAccountId: string
): Permission | undefined => {
  return mockPermissions.find((perm) => perm.subAccountId === subAccountId);
};
