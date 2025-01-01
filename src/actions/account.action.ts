"use server"
import { db } from "@/lib/prisma";
import { seralizedAccount, seralizedTransaction } from "@/lib/utils";
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
    return accounts.map(seralizedAccount);


}
export const upateAccount = async (accountId: string) => {
    try {

        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');
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
        return seralizedAccount(account)

    } catch (error) {
        console.log("🚀 ~ upateAccount ~ error:", error)

    }
}
export const getAccountWithTranaction = async (accountId: string) => {

    try {

        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');

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
        return {
            ...(account ? seralizedAccount(account) : {}),
            transactions: account?.transactions.map(seralizedTransaction)
        }

    } catch (error) {
        console.log("🚀 ~ error:", error)

    }
}


export async function bulkDeleteTransactions(transactionIds: string[]): Promise<{ success: boolean, error?: string }> {

    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');
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
    } catch (error: any) {
        console.log("🚀 ~ bulkDeleteTransactions ~ error:", error)
        return { success: false, error: error.message }

    }
}