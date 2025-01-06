"use server"
import { aj } from "@/app/api/arcjet/route";
import { db } from "@/lib/prisma";
import { seralizedTransaction } from "@/lib/utils";
import { TTransaction } from "@/types/global-types";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { revalidatePath } from "next/cache";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)


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

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
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


// Scan Receipt
export async function scanReceipt(file: any) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        // Convert ArrayBuffer to Base64
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number, without any currency symbols)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            };
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid response format from Gemini");
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}



export async function getTransaction(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');


        const transaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id
            }
        })
        if (!transaction) throw new Error("Transaction not found")
        return seralizedTransaction(transaction)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
export async function updateTransaction(id: string, data: TTransaction) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error('UnAuthorized');
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) throw new Error('User not found');

        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id
            },
            include: {
                account: true
            }
        });
        if (!originalTransaction) throw new Error("Transaction not found")


        // calculate balance changes

        const oldBalanceChange = originalTransaction.type === "EXPENSE" ? -originalTransaction.amount.toNumber() : originalTransaction.amount.toNumber();

        const newBalanceChange = data.type === 'EXPENSE' ? -data.amount.toNumber() : data.amount.toNumber()

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction and account balance 
        const transaction = await db.$transaction(async (tx) => {
            const updateTransaction = await tx.transaction.create({
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
                    balance: netBalanceChange
                }
            })
            return updateTransaction
        })
        revalidatePath('/dashboard')
        revalidatePath(`/account/${transaction.accountId}`)
        return { success: true, data: seralizedTransaction(transaction) }


    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}