import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BaseSDK } from "@/lib/baseSDK";
import { formatCurrency, cn } from "@/lib/utils";
import type { Transaction, SubAccount, FamilyMember } from "@/lib/types";
import AIAssistant from "@/components/AIAssistant";
import type { BotSuggestion } from "@/lib/openaiClient";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [suggestions, setSuggestions] = useState<BotSuggestion[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadData();
    loadSuggestions();
  }, []);

  useEffect(() => {
    const balance = subAccounts
      .filter((acc) => acc.isActive)
      .reduce((sum, acc) => sum + acc.balance, 0);

    setTotalBalance(balance);
  }, [subAccounts]);

  useEffect(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const spent = transactions
      .filter(
        (txn) =>
          txn.type === "debit" &&
          txn.status === "completed" &&
          txn.timestamp >= thirtyDaysAgo
      )
      .reduce((sum, txn) => sum + txn.amount, 0);

    setTotalSpent(spent);

    const pending = transactions.filter((txn) => txn.status === "pending").length;
    setPendingCount(pending);
  }, [transactions]);

  const loadData = () => {
    const allTransactions = BaseSDK.getAllTransactions();
    const allSubAccounts = BaseSDK.getAllSubAccounts();
    const allMembers = BaseSDK.getAllMembers();

    setTransactions(allTransactions.slice(0, 10));
    setSubAccounts(allSubAccounts);
    setMembers(allMembers);
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch("/api/basebot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "suggestions",
        }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "declined":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return "🍔";
      case "transport":
        return "🚗";
      case "entertainment":
        return "🎮";
      case "education":
        return "📚";
      case "shopping":
        return "🛍️";
      default:
        return "💰";
    }
  };

  const handleAdjustLimit = (memberName: string) => {
    console.log(`Adjusting limit for ${memberName}`);
  };

  const handleRevokePermission = (accountId: string, memberName: string) => {
    setSubAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              isActive: false,
              updatedAt: new Date(),
            }
          : account
      )
    );

    console.log(`Permission revoked for ${memberName}`);
  };

  const handleGrantPermission = (accountId: string, memberName: string) => {
    setSubAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              isActive: true,
              updatedAt: new Date(),
            }
          : account
      )
    );

    console.log(`Permission granted for ${memberName}`);
  };

  const handleApproveTransaction = (transactionId: string) => {
    const transactionToApprove = transactions.find(
      (txn) => txn.id === transactionId
    );

    if (!transactionToApprove || transactionToApprove.status !== "pending") {
      return;
    }

    setTransactions((prevTransactions) =>
      prevTransactions.map((txn) =>
        txn.id === transactionId ? { ...txn, status: "completed" } : txn
      )
    );

    setSubAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.id !== transactionToApprove.subAccountId) {
          return account;
        }

        const updatedBalance =
          transactionToApprove.type === "debit"
            ? account.balance - transactionToApprove.amount
            : account.balance + transactionToApprove.amount;

        return {
          ...account,
          balance: updatedBalance,
          updatedAt: new Date(),
        };
      })
    );

    console.log(
      `Transaction approved: ${transactionToApprove.description} for ${formatCurrency(
        transactionToApprove.amount
      )}`
    );
  };

  const handleDeclineTransaction = (transactionId: string) => {
    const transactionToDecline = transactions.find(
      (txn) => txn.id === transactionId
    );

    if (!transactionToDecline || transactionToDecline.status !== "pending") {
      return;
    }

    setTransactions((prevTransactions) =>
      prevTransactions.map((txn) =>
        txn.id === transactionId ? { ...txn, status: "declined" } : txn
      )
    );

    console.log(
      `Transaction rejected: ${transactionToDecline.description} for ${formatCurrency(
        transactionToDecline.amount
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            FamFunds Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your family finances with ease
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Balance
              </h3>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                💰
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBalance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Across all active accounts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Spending
              </h3>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                📊
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last 30 days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pendingCount > 0 ? "Pending Approvals" : "All Clear"}
              </h3>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pendingCount > 0
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : "bg-green-100 dark:bg-green-900/30"
                )}
              >
                {pendingCount > 0 ? "⏱️" : "✅"}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {pendingCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pendingCount > 0
                ? "Require your attention"
                : "No pending approvals"}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No transactions yet
                  </p>
                ) : (
                  transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getMemberName(transaction.memberId)}
                            {transaction.merchant && ` • ${transaction.merchant}`}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {transaction.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-lg font-semibold",
                              transaction.type === "debit"
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            )}
                          >
                            {transaction.type === "debit" ? "-" : "+"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium",
                              getStatusColor(transaction.status)
                            )}
                          >
                            {transaction.status}
                          </span>
                        </div>

                        {transaction.status === "pending" && (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleApproveTransaction(transaction.id)
                              }
                              className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/50"
                              aria-label="Approve"
                            >
                              ✓
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleDeclineTransaction(transaction.id)
                              }
                              className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50"
                              aria-label="Decline"
                            >
                              ✕
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Family Members
              </h2>
              <div className="space-y-3">
                {subAccounts.map((account, index) => {
                  const member = members.find(
                    (m) => m.id === account.memberId
                  );
                  if (!member) return null;

                  const spendPercentage =
                    ((account.spendLimit - account.balance) /
                      account.spendLimit) *
                    100;

                  return (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            account.isActive
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {account.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {formatCurrency(account.balance)}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(spendPercentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          className={cn(
                            "h-full rounded-full",
                            spendPercentage < 70
                              ? "bg-green-500"
                              : spendPercentage < 90
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          )}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {spendPercentage.toFixed(0)}% of {account.spendPeriod}{" "}
                        limit
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAdjustLimit(member.name)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          type="button"
                        >
                          Adjust Limit
                        </motion.button>
                        {account.isActive ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleRevokePermission(account.id, member.name)
                            }
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 transition-colors"
                            type="button"
                          >
                            Revoke Permission
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleGrantPermission(account.id, member.name)
                            }
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50 transition-colors"
                            type="button"
                          >
                            Grant Permission
                          </motion.button>
                        )}
                      </div>

                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AIAssistant suggestions={suggestions} />
    </div>
  );
}
