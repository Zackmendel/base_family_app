import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BaseSDK } from "@/lib/baseSDK";
import { formatCurrency, cn } from "@/lib/utils";
import type { SubAccount, FamilyMember, Permission } from "@/lib/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";

export default function SubAccountPage() {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<SubAccount | null>(
    null
  );
  const [selectedPermissions, setSelectedPermissions] =
    useState<Permission | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const accounts = BaseSDK.getAllSubAccounts();
    const allMembers = BaseSDK.getAllMembers();
    setSubAccounts(accounts);
    setMembers(allMembers);

    if (accounts.length > 0 && !selectedAccount) {
      handleSelectAccount(accounts[0]);
    }
  };

  const handleSelectAccount = (account: SubAccount) => {
    setSelectedAccount(account);
    const permissions = BaseSDK.getPermissions(account.id);
    setSelectedPermissions(permissions);
    setIsEditing(false);
  };

  const handleUpdatePermissions = (updates: Partial<Permission>) => {
    if (!selectedAccount) return;

    try {
      const updated = BaseSDK.updatePermissions(selectedAccount.id, updates);
      setSelectedPermissions(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update permissions:", error);
    }
  };

  const handleUpdateSpendLimit = (
    limit: number,
    period: "daily" | "weekly" | "monthly"
  ) => {
    if (!selectedAccount) return;

    try {
      const updated = BaseSDK.updateSpendLimit(selectedAccount.id, limit, period);
      setSelectedAccount(updated);
      loadData();
    } catch (error) {
      console.error("Failed to update spend limit:", error);
    }
  };

  const handleToggleActive = (accountId: string, isActive: boolean) => {
    try {
      const updated = BaseSDK.updateSubAccount(accountId, { isActive });
      if (selectedAccount?.id === accountId) {
        setSelectedAccount(updated);
      }
      loadData();
    } catch (error) {
      console.error("Failed to toggle account status:", error);
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown";
  };

  const getMember = (memberId: string) => {
    return members.find((m) => m.id === memberId);
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
            Sub-Account Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage permissions and settings for family members
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sub-Accounts
              </h2>

              <div className="space-y-3">
                {subAccounts.map((account, index) => {
                  const member = getMember(account.memberId);
                  if (!member) return null;

                  return (
                    <motion.button
                      key={account.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectAccount(account)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-all",
                        selectedAccount?.id === account.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      )}
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
                      <p className={cn("text-sm mb-1", ROLE_COLORS[member.role])}>
                        {ROLE_LABELS[member.role]}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Balance: {formatCurrency(account.balance)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Limit: {formatCurrency(account.spendLimit)} /{" "}
                        {account.spendPeriod}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            {selectedAccount && selectedPermissions ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {getMemberName(selectedAccount.memberId)}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Account ID: {selectedAccount.id}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleToggleActive(
                          selectedAccount.id,
                          !selectedAccount.isActive
                        )
                      }
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors",
                        selectedAccount.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      )}
                    >
                      {selectedAccount.isActive ? "Deactivate" : "Activate"}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Current Balance
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedAccount.balance)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Spend Limit
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedAccount.spendLimit)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        per {selectedAccount.spendPeriod}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Permission Level
                      </label>
                      <select
                        value={selectedAccount.permissions}
                        onChange={(e) => {
                          const level = e.target.value as
                            | "full"
                            | "limited"
                            | "view-only";
                          BaseSDK.updateSubAccount(selectedAccount.id, {
                            permissions: level,
                          });
                          loadData();
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="full">Full Access</option>
                        <option value="limited">Limited Access</option>
                        <option value="view-only">View Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Spend Period
                      </label>
                      <select
                        value={selectedAccount.spendPeriod}
                        onChange={(e) => {
                          const period = e.target.value as
                            | "daily"
                            | "weekly"
                            | "monthly";
                          handleUpdateSpendLimit(
                            selectedAccount.spendLimit,
                            period
                          );
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Permissions
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 font-medium transition-colors"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Can Transfer Funds
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow transfers to other accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.canTransfer}
                          onChange={(e) =>
                            isEditing &&
                            handleUpdatePermissions({
                              canTransfer: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Can View Family
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          View other family members&apos; accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.canViewFamily}
                          onChange={(e) =>
                            isEditing &&
                            handleUpdatePermissions({
                              canViewFamily: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Can Request Funds
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Request additional funds from parents
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.canRequestFunds}
                          onChange={(e) =>
                            isEditing &&
                            handleUpdatePermissions({
                              canRequestFunds: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Requires Approval
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Transactions need parent approval
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.requiresApproval}
                          onChange={(e) =>
                            isEditing &&
                            handleUpdatePermissions({
                              requiresApproval: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {selectedPermissions.requiresApproval && (
                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Approval Threshold
                        </label>
                        <input
                          type="number"
                          value={selectedPermissions.approvalThreshold || 0}
                          onChange={(e) =>
                            isEditing &&
                            handleUpdatePermissions({
                              approvalThreshold: parseFloat(e.target.value),
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          placeholder="Enter amount"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Transactions above this amount require approval
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a sub-account to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
