"use server"

import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { seralizedAccount } from "@/lib/utils";
import { TModiifiedAccount } from "@/types/global-types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getAllAccounts = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error('UnAuthorized');
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) throw new Error('User not found');
    try {

        const accounts = await db.account.findMany({
            where: {
                userId: user.id,

            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                _count: {
                    select: {
                        transactions: true
                    }
                }

            }
        })
        return accounts.map(account => ({
            ...account,
            balance: account.balance.toNumber()
        }));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }



}
export const upateAccount = async (accountId: string) => {
    try {

        const user = await getAuthenticatedUser();
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        })
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: {
                isDefault: true
            }
        })
        revalidatePath("/")
        return seralizedAccount(account as TModiifiedAccount)

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
export const getAccountWithTranaction = async (accountId: string) => {

    try {

        const user = await getAuthenticatedUser();

        if (!accountId) return null

        const account = await db.account.findUnique({
            where: {
                id: accountId,
                userId: user.id
            },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: "desc"
                    },

                },
                _count: {
                    select: {
                        transactions: true
                    }
                }
            }
        })
        const serializedTransactions = account?.transactions.map(transaction => ({
            ...transaction,
            amount: transaction.amount.toNumber(),
        }));
        return {
            ...(account ? {
                ...account,
                balance: account.balance.toNumber(),
            } : {}),
            transactions: serializedTransactions
        }

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}


export async function bulkDeleteTransactions(transactionIds: string[]): Promise<{ success: boolean, error?: string }> {

    try {
        const user = await getAuthenticatedUser();
        const transaction = await db.transaction.findMany({
            where: {
                id: {
                    in: transactionIds,

                },
                userId: user.id,
            }
        })

        const accountBalanceChanges: Record<string, number> = transaction.reduce((acc, transaction) => {


            const change = transaction.type === "INCOME" ? -transaction.amount : transaction.amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + Number(change);
            return acc;
        }, {} as Record<string, number>)

        // Delete  transactions and update account balance in a transaction
        await db.$transaction(async (tsx) => {

            await tsx.transaction.deleteMany({
                where: { id: { in: transactionIds } }
            })
            for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
                await tsx.account.update({
                    where: { id: accountId },
                    data: { balance: { increment: balanceChange } }
                });
            }
            await tsx.transaction.deleteMany({
                where: { id: { in: transactionIds } }
            });
        });
        revalidatePath("/dashboard")
        revalidatePath("/account/[id]")
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}