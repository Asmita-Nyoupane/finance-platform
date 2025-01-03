'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getCurrentBudget = async (accountId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');
        const budget = await db.budget.findFirst({
            where: {
                userId: user.id
            }
        })
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: 'EXPENSE',
                date: {
                    gte: startOfMonth
                    ,
                    lte: endOfMonth
                },
                accountId,
            },
            _sum: {
                amount: true
            }
        })
        return {
            budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
            currentEcpenses: expenses._sum.amount ? expenses._sum.amount.toNumber() : 0
        }

    } catch (error) {
        console.log("🚀 ~ getCurrentBudget ~ error:", error)
        throw error;

    }
}
export const updateBudget = async (amount: number) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');

        const budget = await db.budget.upsert({
            where: {
                userId: user.id
            },
            update: {
                amount
            },
            create: {

                userId: user.id,
                amount
            },
        }
        )
        revalidatePath('/dashboard')
        return {
            ...budget,
            amount: budget.amount.toNumber()
        }
    } catch (error) {
        console.log("🚀 ~ updateBudget ~ error:", error)
        throw error
    }
}