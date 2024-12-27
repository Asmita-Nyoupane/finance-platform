'use server'

import { db } from "@/lib/prisma";
import { TAccount } from "@/types/global-types";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
type TProps = {
    data: TAccount
}

// const serializedTrasaction = (obj: TAccount) => {
//     const serialized = { ...obj };
//     if (obj.balance) {
//         serialized.balance = obj.balance.toNumber();
//     }
//     return serialized;
// }

export const createAccount = async ({ data }: TProps) => {


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
        const balanceFloat = parseFloat(data.balance.toString())
        if (isNaN(balanceFloat)) throw new Error('Invalid balance');

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
                ...data,
                balance: balanceFloat,
                isDefault: shouldBeDefault,
                userId: user.id
            }
        })
        revalidatePath('/dashboard')
        return newAccount;

    } catch (error) {
        console.log("🚀 ~ createAccount ~ error:", error)

    }

}
