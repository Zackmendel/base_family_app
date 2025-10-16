import type {
  FamilyMember,
  SubAccount,
  Transaction,
  Permission,
  SpendLimit,
} from "./types";
import {
  mockFamilyMembers,
  mockSubAccounts,
  mockTransactions,
  mockPermissions,
} from "./mockData";

let familyMembers: FamilyMember[] = [...mockFamilyMembers];
let subAccounts: SubAccount[] = [...mockSubAccounts];
let transactions: Transaction[] = [...mockTransactions];
let permissions: Permission[] = [...mockPermissions];

export class BaseSDK {
  static getAllMembers(): FamilyMember[] {
    return [...familyMembers];
  }

  static getMemberById(id: string): FamilyMember | null {
    return familyMembers.find((member) => member.id === id) || null;
  }

  static getAllSubAccounts(): SubAccount[] {
    return [...subAccounts];
  }

  static getSubAccountById(id: string): SubAccount | null {
    return subAccounts.find((account) => account.id === id) || null;
  }

  static getSubAccountByMemberId(memberId: string): SubAccount | null {
    return subAccounts.find((account) => account.memberId === memberId) || null;
  }

  static createSubAccount(
    memberId: string,
    initialBalance: number = 0,
    spendLimit: number = 100,
    spendPeriod: "daily" | "weekly" | "monthly" = "weekly",
    permissionLevel: "full" | "limited" | "view-only" = "limited"
  ): SubAccount {
    const member = this.getMemberById(memberId);
    if (!member) {
      throw new Error(`Member with id ${memberId} not found`);
    }

    const existingAccount = this.getSubAccountByMemberId(memberId);
    if (existingAccount) {
      throw new Error(
        `Sub-account already exists for member ${member.name}`
      );
    }

    const newAccount: SubAccount = {
      id: `sub-${Date.now()}`,
      memberId,
      balance: initialBalance,
      spendLimit,
      spendPeriod,
      permissions: permissionLevel,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    subAccounts.push(newAccount);

    const newPermission: Permission = {
      subAccountId: newAccount.id,
      canTransfer: permissionLevel === "full",
      canViewFamily: permissionLevel !== "view-only",
      canRequestFunds: true,
      requiresApproval: permissionLevel !== "full",
      approvalThreshold: permissionLevel === "view-only" ? 25 : 50,
    };

    permissions.push(newPermission);

    return newAccount;
  }

  static updateSubAccount(
    subAccountId: string,
    updates: Partial<Omit<SubAccount, "id" | "memberId" | "createdAt">>
  ): SubAccount {
    const index = subAccounts.findIndex(
      (account) => account.id === subAccountId
    );

    if (index === -1) {
      throw new Error(`Sub-account with id ${subAccountId} not found`);
    }

    subAccounts[index] = {
      ...subAccounts[index],
      ...updates,
      updatedAt: new Date(),
    };

    return subAccounts[index];
  }

  static deleteSubAccount(subAccountId: string): boolean {
    const index = subAccounts.findIndex(
      (account) => account.id === subAccountId
    );

    if (index === -1) {
      return false;
    }

    subAccounts.splice(index, 1);

    const permIndex = permissions.findIndex(
      (perm) => perm.subAccountId === subAccountId
    );
    if (permIndex !== -1) {
      permissions.splice(permIndex, 1);
    }

    return true;
  }

  static getSpendLimit(subAccountId: string): SpendLimit | null {
    const account = this.getSubAccountById(subAccountId);
    if (!account) {
      return null;
    }

    const spendLimit: SpendLimit = {
      subAccountId: account.id,
    };

    switch (account.spendPeriod) {
      case "daily":
        spendLimit.dailyLimit = account.spendLimit;
        break;
      case "weekly":
        spendLimit.weeklyLimit = account.spendLimit;
        break;
      case "monthly":
        spendLimit.monthlyLimit = account.spendLimit;
        break;
    }

    return spendLimit;
  }

  static updateSpendLimit(
    subAccountId: string,
    limit: number,
    period: "daily" | "weekly" | "monthly"
  ): SubAccount {
    return this.updateSubAccount(subAccountId, {
      spendLimit: limit,
      spendPeriod: period,
    });
  }

  static getPermissions(subAccountId: string): Permission | null {
    return permissions.find((perm) => perm.subAccountId === subAccountId) || null;
  }

  static updatePermissions(
    subAccountId: string,
    updates: Partial<Omit<Permission, "subAccountId">>
  ): Permission {
    const index = permissions.findIndex(
      (perm) => perm.subAccountId === subAccountId
    );

    if (index === -1) {
      throw new Error(`Permissions for sub-account ${subAccountId} not found`);
    }

    permissions[index] = {
      ...permissions[index],
      ...updates,
    };

    return permissions[index];
  }

  static getAllTransactions(): Transaction[] {
    return [...transactions].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  static getTransactionsBySubAccountId(subAccountId: string): Transaction[] {
    return transactions
      .filter((txn) => txn.subAccountId === subAccountId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static getTransactionById(id: string): Transaction | null {
    return transactions.find((txn) => txn.id === id) || null;
  }

  static simulateTransaction(
    subAccountId: string,
    amount: number,
    type: "debit" | "credit",
    category: string,
    description: string,
    merchant?: string
  ): Transaction {
    const account = this.getSubAccountById(subAccountId);
    if (!account) {
      throw new Error(`Sub-account with id ${subAccountId} not found`);
    }

    if (!account.isActive) {
      throw new Error("Sub-account is not active");
    }

    const permission = this.getPermissions(subAccountId);
    let status: "pending" | "completed" | "declined" = "completed";

    if (type === "debit") {
      if (amount > account.balance) {
        status = "declined";
      } else if (permission?.requiresApproval && permission.approvalThreshold) {
        if (amount >= permission.approvalThreshold) {
          status = "pending";
        }
      }

      const currentSpending = this.calculateCurrentSpending(
        subAccountId,
        account.spendPeriod
      );
      if (currentSpending + amount > account.spendLimit && status !== "declined") {
        status = "pending";
      }
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      subAccountId,
      memberId: account.memberId,
      amount,
      type,
      category,
      description,
      merchant,
      status,
      timestamp: new Date(),
      metadata: {
        requiresApproval: status === "pending",
      },
    };

    transactions.push(transaction);

    if (status === "completed") {
      const newBalance =
        type === "debit"
          ? account.balance - amount
          : account.balance + amount;
      this.updateSubAccount(subAccountId, { balance: newBalance });
    }

    return transaction;
  }

  static approveTransaction(transactionId: string): Transaction {
    const index = transactions.findIndex((txn) => txn.id === transactionId);

    if (index === -1) {
      throw new Error(`Transaction with id ${transactionId} not found`);
    }

    const transaction = transactions[index];

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending approval");
    }

    const account = this.getSubAccountById(transaction.subAccountId);
    if (!account) {
      throw new Error("Sub-account not found");
    }

    if (transaction.type === "debit" && transaction.amount > account.balance) {
      transactions[index] = {
        ...transaction,
        status: "declined",
      };
    } else {
      const newBalance =
        transaction.type === "debit"
          ? account.balance - transaction.amount
          : account.balance + transaction.amount;

      this.updateSubAccount(transaction.subAccountId, { balance: newBalance });

      transactions[index] = {
        ...transaction,
        status: "completed",
      };
    }

    return transactions[index];
  }

  static declineTransaction(transactionId: string): Transaction {
    const index = transactions.findIndex((txn) => txn.id === transactionId);

    if (index === -1) {
      throw new Error(`Transaction with id ${transactionId} not found`);
    }

    transactions[index] = {
      ...transactions[index],
      status: "declined",
    };

    return transactions[index];
  }

  private static calculateCurrentSpending(
    subAccountId: string,
    period: "daily" | "weekly" | "monthly"
  ): number {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    return transactions
      .filter(
        (txn) =>
          txn.subAccountId === subAccountId &&
          txn.type === "debit" &&
          txn.status === "completed" &&
          txn.timestamp >= startDate
      )
      .reduce((sum, txn) => sum + txn.amount, 0);
  }

  static resetData(): void {
    familyMembers = [...mockFamilyMembers];
    subAccounts = [...mockSubAccounts];
    transactions = [...mockTransactions];
    permissions = [...mockPermissions];
  }
}
