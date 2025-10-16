import {
  FamilyCardData,
  SpendChartData,
  SpendControlData,
} from "./types";
import { CATEGORY_COLORS } from "./constants";

export const mockFamilyMembers: FamilyCardData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "parent",
    balance: 750.5,
    spendLimit: 1000,
    isActive: true,
  },
  {
    id: "2",
    name: "Michael Johnson",
    role: "parent",
    avatar: "https://i.pravatar.cc/150?img=12",
    balance: 450.25,
    spendLimit: 1000,
    isActive: true,
  },
  {
    id: "3",
    name: "Emma Johnson",
    role: "child",
    balance: 180.0,
    spendLimit: 200,
    isActive: true,
  },
  {
    id: "4",
    name: "Lucas Johnson",
    role: "child",
    avatar: "https://i.pravatar.cc/150?img=8",
    balance: 95.5,
    spendLimit: 150,
    isActive: false,
  },
];

export const mockSpendChartData: SpendChartData = {
  categories: [
    {
      name: "food",
      amount: 450.75,
      color: CATEGORY_COLORS.food,
    },
    {
      name: "transport",
      amount: 125.5,
      color: CATEGORY_COLORS.transport,
    },
    {
      name: "entertainment",
      amount: 89.99,
      color: CATEGORY_COLORS.entertainment,
    },
    {
      name: "education",
      amount: 200.0,
      color: CATEGORY_COLORS.education,
    },
    {
      name: "shopping",
      amount: 156.23,
      color: CATEGORY_COLORS.shopping,
    },
  ],
  totalSpent: 1022.47,
  totalBudget: 1500.0,
  period: "monthly",
};

export const mockSpendControlData: SpendControlData = {
  memberId: "3",
  memberName: "Emma Johnson",
  currentSpending: 140.5,
  dailyLimit: 20.0,
  weeklyLimit: 75.0,
  monthlyLimit: 200.0,
  period: "weekly",
};

export const mockEmptySpendChartData: SpendChartData = {
  categories: [],
  totalSpent: 0,
  totalBudget: 1500.0,
  period: "monthly",
};
