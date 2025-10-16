import type { Transaction, SubAccount, FamilyMember } from "./types";

export interface BotSuggestion {
  type: "spending_alert" | "savings_tip" | "approval_recommendation" | "budget_insight";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  action?: {
    label: string;
    type: string;
    data?: Record<string, unknown>;
  };
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export class BaseBotClient {
  private static isInitialized = false;

  static initialize(apiKey?: string): void {
    if (apiKey) {
      console.log("BaseBot initialized with API key");
    } else {
      console.log("BaseBot initialized in mock mode");
    }
    this.isInitialized = true;
  }

  static async getSpendingSuggestion(
    transaction: Transaction,
    subAccount: SubAccount,
    member: FamilyMember
  ): Promise<BotSuggestion> {
    await this.simulateDelay();

    if (transaction.amount > subAccount.spendLimit * 0.8) {
      return {
        type: "spending_alert",
        priority: "high",
        title: "High Spending Alert",
        message: `${member.name}'s purchase of $${transaction.amount.toFixed(2)} is approaching their ${subAccount.spendPeriod} limit of $${subAccount.spendLimit.toFixed(2)}.`,
        action: {
          label: "Review Budget",
          type: "navigate",
          data: { path: `/accounts/${subAccount.id}` },
        },
      };
    }

    if (transaction.category === "entertainment" && transaction.amount > 50) {
      return {
        type: "approval_recommendation",
        priority: "medium",
        title: "Entertainment Purchase",
        message: `${member.name} is requesting approval for a $${transaction.amount.toFixed(2)} entertainment purchase. This is within typical spending patterns.`,
        action: {
          label: "Review Request",
          type: "approve_transaction",
          data: { transactionId: transaction.id },
        },
      };
    }

    return {
      type: "budget_insight",
      priority: "low",
      title: "Normal Transaction",
      message: `Transaction of $${transaction.amount.toFixed(2)} for ${transaction.category} is within normal spending patterns.`,
    };
  }

  static async getSavingsTip(
    totalSpending: number,
    timeframe: "weekly" | "monthly"
  ): Promise<BotSuggestion> {
    await this.simulateDelay();

    const tips = [
      {
        title: "Save on Groceries",
        message: `Your family spent $${totalSpending.toFixed(2)} this ${timeframe}. Consider meal planning to reduce grocery costs by 15-20%.`,
      },
      {
        title: "Entertainment Budget",
        message: `Track entertainment expenses more closely. Setting a family entertainment budget could save $50-100 per month.`,
      },
      {
        title: "Subscription Review",
        message: `Review active subscriptions. Families typically save $30-50/month by canceling unused services.`,
      },
    ];

    const tip = tips[Math.floor(Math.random() * tips.length)];

    return {
      type: "savings_tip",
      priority: "medium",
      ...tip,
      action: {
        label: "Learn More",
        type: "navigate",
        data: { path: "/tips" },
      },
    };
  }

  static async analyzeBudget(
    subAccount: SubAccount,
    recentTransactions: Transaction[]
  ): Promise<BotSuggestion> {
    await this.simulateDelay();

    const totalSpent = recentTransactions
      .filter((txn) => txn.type === "debit" && txn.status === "completed")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const spendingRate = (totalSpent / subAccount.spendLimit) * 100;

    if (spendingRate > 90) {
      return {
        type: "spending_alert",
        priority: "high",
        title: "Budget Limit Reached",
        message: `This account has used ${spendingRate.toFixed(0)}% of its ${subAccount.spendPeriod} budget. Consider adjusting the limit or reviewing recent purchases.`,
        action: {
          label: "View Transactions",
          type: "navigate",
          data: { path: `/accounts/${subAccount.id}/transactions` },
        },
      };
    }

    if (spendingRate > 75) {
      return {
        type: "budget_insight",
        priority: "medium",
        title: "Budget Warning",
        message: `This account has used ${spendingRate.toFixed(0)}% of its ${subAccount.spendPeriod} budget. Spending is on track but monitor closely.`,
      };
    }

    return {
      type: "budget_insight",
      priority: "low",
      title: "Budget On Track",
      message: `Spending is well within limits at ${spendingRate.toFixed(0)}% of the ${subAccount.spendPeriod} budget.`,
    };
  }

  static async chat(
    messages: ChatMessage[],
    context?: Record<string, unknown>
  ): Promise<string> {
    await this.simulateDelay();

    const lastMessage = messages[messages.length - 1];

    const mockResponses = [
      "Based on your family's spending patterns, I recommend setting aside 20% of the weekly allowance for savings.",
      "I've analyzed the recent transactions and noticed increased spending in the entertainment category. Would you like me to suggest some budget adjustments?",
      "Your family is doing great with budget management! The kids are staying within their limits.",
      "I can help you set up spending alerts for transactions over a certain amount. Would you like to configure that?",
      "Consider creating a savings goal for the family. Research shows that families with clear goals save 30% more.",
    ];

    if (lastMessage.content.toLowerCase().includes("save")) {
      return "I can help you create a savings plan. Would you like to start by setting a monthly savings goal?";
    }

    if (lastMessage.content.toLowerCase().includes("budget")) {
      return "Let me analyze your current budget. Based on recent spending, I can suggest optimizations.";
    }

    if (lastMessage.content.toLowerCase().includes("transaction")) {
      return "I can show you transaction details and patterns. What specific information would you like to see?";
    }

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  private static simulateDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 300 + Math.random() * 700);
    });
  }

  static isReady(): boolean {
    return this.isInitialized;
  }
}

export const mockBotSuggestions: BotSuggestion[] = [
  {
    type: "spending_alert",
    priority: "high",
    title: "Weekly Limit Alert",
    message: "Emma's spending is at 85% of her weekly limit. Consider reviewing recent purchases.",
    action: {
      label: "Review",
      type: "navigate",
      data: { path: "/accounts/sub-3" },
    },
  },
  {
    type: "savings_tip",
    priority: "medium",
    title: "Savings Opportunity",
    message: "Setting up automatic savings transfers could help reach family goals faster.",
    action: {
      label: "Set Up",
      type: "navigate",
      data: { path: "/savings" },
    },
  },
  {
    type: "approval_recommendation",
    priority: "high",
    title: "Approval Request",
    message: "Lucas is requesting approval for a $60 video game purchase. This exceeds his approval threshold.",
    action: {
      label: "Review Request",
      type: "approve_transaction",
      data: { transactionId: "txn-5" },
    },
  },
  {
    type: "budget_insight",
    priority: "low",
    title: "Monthly Summary",
    message: "Family spending is 20% lower than last month. Great job managing the budget!",
  },
];
