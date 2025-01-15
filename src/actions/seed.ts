"use server";

import { db } from "@/lib/prisma";
import { TAsyncTransaction, TTransaction } from "@/types/global-types";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { subDays } from "date-fns";

const ACCOUNT_ID = "9df9c60f-a09a-49df-8569-b87ec8f103a7";
const USER_ID = "fc3a87a2-cb98-4c29-81e1-5bd88214c71f";

// Categories with their typical amount ranges
const CATEGORIES = {
    INCOME: [
        { name: "salary", range: [5000, 8000] },
        { name: "freelance", range: [1000, 3000] },
        { name: "investments", range: [500, 2000] },
        { name: "other-income", range: [100, 1000] },
    ],
    EXPENSE: [
        { name: "housing", range: [1000, 2000] },
        { name: "transportation", range: [100, 500] },
        { name: "groceries", range: [200, 600] },
        { name: "utilities", range: [100, 300] },
        { name: "entertainment", range: [50, 200] },
        { name: "food", range: [50, 150] },
        { name: "shopping", range: [100, 500] },
        { name: "healthcare", range: [100, 1000] },
        { name: "education", range: [200, 1000] },
        { name: "travel", range: [500, 2000] },
    ],
};

// Helper to generate random amount within a range
function getRandomAmount(min: number, max: number) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type: TransactionType) {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
}

export async function seedTransactions() {
    try {
        // Generate 90 days of transactions
        const transactions = [] as TTransaction[];
        let totalBalance = 0;

        for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);

            // Generate 1-3 transactions per day
            const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
                // 40% chance of income, 60% chance of expense
                const type: TransactionType = Math.random() < 0.4 ? TransactionType.INCOME : TransactionType.EXPENSE;
                const { category, amount } = getRandomCategory(type);

                const transaction = {
                    id: crypto.randomUUID(),
                    type,
                    amount: new Decimal(amount),
                    description: `${type === "INCOME" ? "Received" : "Paid for"
                        } ${category}`,
                    date,
                    category,
                    status: TransactionStatus.COMPLETED,
                    isRecurring: false,
                    userId: USER_ID,
                    accountId: ACCOUNT_ID,
                    createdAt: date,
                    updatedAt: date,
                };

                totalBalance += type === "INCOME" ? amount : -amount;
                transactions.push(transaction as TAsyncTransaction);
            }
        }

        // Insert transactions in batches and update account balance
        await db.$transaction(async (tx) => {
            // Clear existing transactions
            await tx.transaction.deleteMany({
                where: { accountId: ACCOUNT_ID },
            });

            // Insert new transactions
            await tx.transaction.createMany({
                data: transactions,
            });

            // Update account balance
            await tx.account.update({
                where: { id: ACCOUNT_ID },
                data: { balance: totalBalance },
            });
        });

        return {
            success: true,
            message: `Created ${transactions.length} transactions`,
        };
        // eslint-disable-next-line
    } catch (error: any) {
        console.error("Error seeding transactions:", error);
        return { success: false, error: error.message };
    }
}