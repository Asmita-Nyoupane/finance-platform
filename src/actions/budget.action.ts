'use server'

import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getCurrentBudget = async (accountId: string) => {
    try {
        const user = await getAuthenticatedUser();
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
            currentExpenses: expenses._sum.amount ? expenses._sum.amount.toNumber() : 0
        }

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
export const updateBudget = async (amount: number) => {
    try {
        const user = await getAuthenticatedUser();

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
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}