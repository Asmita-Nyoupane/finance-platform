"use server"
import { db } from "@/lib/prisma";
import { seralizedAccount, seralizedTransaction } from "@/lib/utils";
import { TTransaction } from "@/types/global-types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { start } from "repl";

export const createTransaction = async (data: TTransaction) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');
        // arject to add rate limit
        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id
            }
        })
        if (!account) throw new Error("Account not found")

        const balanceChange = data.type === 'EXPENSE' ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + Number(balanceChange);
        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.date, data.recurringInterval) : null
                }
            })
            await tx.account.update({
                where: {
                    id: data.accountId
                },
                data: {
                    balance: newBalance
                }
            })
            return newTransaction
        })
        revalidatePath('/dashboard')
        revalidatePath(`/account/${transaction.accountId}`)
        return { success: true, data: seralizedTransaction(transaction) }

    } catch (error: any) {
        throw error
    }
}
function calculateNextRecurringDate(startDate: Date, interval: string) {
    const date = new Date(startDate)
    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1)
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7)
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1)
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1)
            break;
        default:
            break;
    }
    return date
}