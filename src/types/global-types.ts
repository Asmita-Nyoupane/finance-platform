import { AccountType, RecurringInterval, TransactionStatus, TransactionType } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type TAccount = {
    name: string
    type: AccountType
    balance: number
    isDefault: boolean
}
export type TAsycncAccount = {
    name: string;
    type: AccountType;
    isDefault: boolean;
    balance: number,
    userId: string;
    id: string;
    amount?: number
    createdAt?: Date;
    updatedAt?: Date;
    transaction?: TTransaction[]
}
export type TModiifiedAccount = TAsycncAccount & {
    balance: Decimal,
    amount: Decimal
}
// Transaction Type
export type TTransaction = {
    id: string;
    type: TransactionType;
    userId: string;
    amount: number
    accountId: string;
    description?: string | null;
    date: Date;
    category: string;
    receiptUrl?: string | null;
    isRecurring: boolean;
    recurringInterval?: RecurringInterval | null;
    nextRecurringDate?: Date | null;
    lastProcessed?: Date | null;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
};
export type TAsyncTransaction = TTransaction & {
    amount: Decimal
}

// Budget Type
export type TBudget = {
    id: string;
    amount: Decimal;
    userId: string;
    lastAlertSent?: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
export type TAccountWithTransactions = {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
    isDefault: boolean;
    userId: string;
    transactions?: TTransaction[];
    createdAt?: Date;
    updatedAt?: Date;
    _count: { transactions: number }
};

// Enums for TransactionType, RecurringInterval, and TransactionStatus
// export enum TransactionType {
//     INCOME = "INCOME",
//     EXPENSE = "EXPENSE",
// }

// export enum RecurringInterval {
//     DAILY = "DAILY",
//     WEEKLY = "WEEKLY",
//     MONTHLY = "MONTHLY",
//     YEARLY = "YEARLY",
// }

// export enum TransactionStatus {
//     PENDING = "PENDING",
//     COMPLETED = "COMPLETED",
//     FAILED = "FAILED",
// }

