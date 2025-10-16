import type { NextApiRequest, NextApiResponse } from "next";
import { BaseBotClient, type BotSuggestion } from "@/lib/openaiClient";
import { BaseSDK } from "@/lib/baseSDK";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  action: "chat" | "suggestions" | "analyze";
  messages?: ChatMessage[];
  subAccountId?: string;
  transactionId?: string;
}

interface ChatResponse {
  message?: string;
  suggestions?: BotSuggestion[];
  error?: string;
}

BaseBotClient.initialize();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action, messages, subAccountId, transactionId }: ChatRequest = req.body;

    switch (action) {
      case "chat": {
        if (!messages || messages.length === 0) {
          return res.status(400).json({ error: "Messages are required for chat" });
        }

        const response = await BaseBotClient.chat(messages);
        return res.status(200).json({ message: response });
      }

      case "suggestions": {
        const allSubAccounts = BaseSDK.getAllSubAccounts();
        const allTransactions = BaseSDK.getAllTransactions();
        const allMembers = BaseSDK.getAllMembers();

        const suggestions: BotSuggestion[] = [];

        for (const subAccount of allSubAccounts) {
          if (!subAccount.isActive) continue;

          const member = allMembers.find((m) => m.id === subAccount.memberId);
          if (!member) continue;

          const recentTransactions = BaseSDK.getTransactionsBySubAccountId(
            subAccount.id
          ).slice(0, 10);

          const suggestion = await BaseBotClient.analyzeBudget(
            subAccount,
            recentTransactions
          );

          if (suggestion.priority === "high" || suggestion.priority === "medium") {
            suggestions.push(suggestion);
          }
        }

        const pendingTransactions = allTransactions.filter(
          (txn) => txn.status === "pending"
        );

        for (const transaction of pendingTransactions) {
          const subAccount = BaseSDK.getSubAccountById(transaction.subAccountId);
          const member = allMembers.find((m) => m.id === transaction.memberId);

          if (subAccount && member) {
            const suggestion = await BaseBotClient.getSpendingSuggestion(
              transaction,
              subAccount,
              member
            );

            suggestions.push(suggestion);
          }
        }

        const activeAccounts = allSubAccounts.filter((acc) => acc.isActive);
        if (activeAccounts.length > 0) {
          const totalSpending = allTransactions
            .filter(
              (txn) =>
                txn.type === "debit" &&
                txn.status === "completed" &&
                txn.timestamp >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
            .reduce((sum, txn) => sum + txn.amount, 0);

          if (totalSpending > 0) {
            const savingsTip = await BaseBotClient.getSavingsTip(
              totalSpending,
              "weekly"
            );
            suggestions.push(savingsTip);
          }
        }

        return res.status(200).json({ suggestions });
      }

      case "analyze": {
        if (!subAccountId) {
          return res.status(400).json({ error: "subAccountId is required" });
        }

        const subAccount = BaseSDK.getSubAccountById(subAccountId);
        if (!subAccount) {
          return res.status(404).json({ error: "Sub-account not found" });
        }

        const recentTransactions = BaseSDK.getTransactionsBySubAccountId(
          subAccountId
        ).slice(0, 20);

        const suggestion = await BaseBotClient.analyzeBudget(
          subAccount,
          recentTransactions
        );

        return res.status(200).json({
          message: suggestion.message,
          suggestions: [suggestion],
        });
      }

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("BaseBot API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
