'use server'
import { db } from "@/lib/prisma";
import { TAccount, TAsycncAccount } from "@/types/global-types";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
type TProps = {
    data: TAccount
}


const seralizedTransaction = (obj: TAsycncAccount) => {

    if (obj.balance) {
        return {
            ...obj,
            balance: obj.balance.toNumber()
        }
    }
}
export const createAccount = async (data: TProps) => {

    try {

        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');


        // convert balance into decimal
        const balanceFloat = parseFloat(data.data.balance.toString())
        if (isNaN(data.data.balance)) throw new Error('Invalid balance');

        // find user existing accounts
        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            }
        });
        const shouldBeDefault = existingAccounts.length === 0 ? true : data.data.isDefault;
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
                name: data.data.name,
                balance: balanceFloat,
                isDefault: shouldBeDefault,
                userId: user.id,
                type: data.data.type
            }
        })
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
