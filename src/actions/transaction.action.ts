"use server"
import { aj } from "@/app/api/arcjet/route";
import { db } from "@/lib/prisma";
import { seralizedTransaction } from "@/lib/utils";
import { TTransaction } from "@/types/global-types";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


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
        const req = await request()

        const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 1 tokens from the bucket

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDRD",
                    details: {
                        remaining,
                        resetInSeconds: reset
                    }
                })
                throw new Error("Too many request.Please try again later")
            }
            throw new Error("Request Blocked")
        }


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
        console.log("🚀 ~ createTransaction ~ error:", error)
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