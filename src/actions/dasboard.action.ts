'use server'
import { db } from "@/lib/prisma";
import { TAccount, TAsycncAccount } from "@/types/global-types";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";



const seralizedTransaction = (obj: TAsycncAccount) => {

    if (typeof obj.balance !== "number") {
        return {
            ...obj,
            balance: obj.balance.toNumber()
        };
    }
    return obj;
}
export const createAccount = async (data: TAccount) => {


    try {

        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');
        if (!data) throw new Error("Invalid data structure");
        if (typeof data.balance === "undefined") throw new Error("Balance is missing");
        if (isNaN(data.balance)) throw new Error("Invalid balance");

        // find user existing accounts
        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            }
        });
        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            })
        }
        const newAccount = await db.account.create({
            data: {
                name: data.name,
                balance: data.balance,
                isDefault: shouldBeDefault,
                userId: user.id,
                type: data.type
            }
        })
        console.log("🚀 ~ createAccount ~ newAccount :", newAccount)
        revalidatePath('/dashboard')
        return seralizedTransaction(newAccount);

    } catch (error) {
        console.log("🚀 ~ createAccount ~ error:", error)

    }

}
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
    return accounts.map(seralizedTransaction);


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
        return seralizedTransaction(account)

    } catch (error) {
        console.log("🚀 ~ upateAccount ~ error:", error)

    }
}