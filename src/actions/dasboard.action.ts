'use server'
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { seralizedAccount, seralizedTransaction } from "@/lib/utils";
import { TAccount, TAsyncTransaction, TModiifiedAccount } from "@/types/global-types";
import { revalidatePath } from "next/cache";




export const createAccount = async (data: TAccount) => {


    try {

        const user = await getAuthenticatedUser();
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
        return seralizedAccount(newAccount as TModiifiedAccount);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }

}
export async function getDashboarData() {
    const user = await getAuthenticatedUser();;
    try {
        // get all user transaction
        const transactions = await db.transaction.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                date: "desc"
            }
        })

        // Cast `transactions` to `TAsyncTransaction[]`
        const typedTransactions = transactions as TAsyncTransaction[];

        // Map over the typed transactions and serialize them
        return typedTransactions.map(seralizedTransaction);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }

}