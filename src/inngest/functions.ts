import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { POST } from "@/app/api/send/route";
import Emailtemplate, { TStats } from "../../emails/email-template";
import { TTransaction } from "@/types/global-types";
import { calculateNextRecurringDate } from "@/actions/transaction.action";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudgetalert = inngest.createFunction(
    { id: "check-budget-alert", name: "Check Budget Alert" },
    { cron: "0 */6 * * *" },

    async ({ step }) => {
        const budgets = await step.run("fetch-budget", async () => {

            return await db.budget.findMany({
                include: {
                    user: {
                        include: {
                            accounts: {
                                where: {
                                    isDefault: true
                                }
                            }
                        }
                    }
                }
            });
        });

        for (const budget of budgets) {
            const defaultAccount = budget.user.accounts[0];
            if (!defaultAccount) continue; // skip if no default account
            await step.run(`check-budget-${budget.id}`, async () => {
                const currentDate = new Date();
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                const expenses = await db.transaction.aggregate({

                    where: {
                        userId: budget.userId,
                        type: 'EXPENSE',
                        date: {
                            gte: startOfMonth
                            ,
                            lte: endOfMonth
                        },
                        accountId: defaultAccount.id
                    },
                    _sum: {
                        amount: true
                    }
                }) // get expenses for the month

                const totalExpenses = expenses._sum.amount ? expenses._sum.amount.toNumber() : 0;
                const budgetAmount = Number(budget.amount);
                const percentUsed = (totalExpenses / Number(budgetAmount)) * 100;

                if (percentUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {
                    // send email to user
                    await POST({
                        to: budget.user.email || "",
                        subject: `Budget Alert for ${defaultAccount.name}`,
                        react: Emailtemplate({
                            userName: budget.user.name || "",
                            type: "budget-alert",
                            data: {
                                percentageUsed: percentUsed,
                                budgetAmount: Number(budgetAmount),
                                totalExpense: totalExpenses,
                            }
                        })
                    })
                    // update lastAlertSent
                    await db.budget.update({
                        where: {
                            id: budget.id
                        },
                        data: {
                            lastAlertSent: new Date()
                        }
                    })
                }
            });
        }
    },


);

function isNewMonth(lastAlertDate: Date, currentDate: Date) {

    return (
        lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
}
export const triggerRecuringTransaction = inngest.createFunction({
    id: "trigger recurring transaction",
    name: "Trigger Recurring Transaction",

}, {
    cron: "0 0 * * *"
}, async ({ step }) => {
    // 1.Fetch all of recuriing transactions
    const recurringTransactions = await step.run("fetch=recurring-transactions", async () => {
        return await db.transaction.findMany({
            where: {
                isRecurring: true,
                status: "COMPLETED",
                OR: [
                    { lastProcessed: null },// Never processed
                    {
                        nextRecurringDate: {
                            lte: new Date() //due date passed
                        }
                    }
                ]
            }
        })
    })
    //  2.Create events for each transactins

    if (recurringTransactions.length > 0) {
        const events = recurringTransactions.map((transaction) => ({
            name: "transaction.recurring.process",
            data: { transactionId: transaction.id, userId: transaction.userId }
        }))
        //3.Send event to be processed
        await inngest.send(events)
    }

    return { triggered: recurringTransactions.length }
})



export const processedRecuringTransaction = inngest.createFunction({

    id: 'process-recurring-transaction',
    throttle: {
        limit: 10, //Only process 10 transactions
        period: "1m",//per minute
        key: "event.data.userId", // per user
    },

},
    //event patching
    { event: "transaction.recurring.process" },
    async ({ event, step }) => {
        // validate event data
        if (!event?.data?.transactionId || !event?.data?.userId) {
            console.log("Invalid ecent data", event)
            return {
                error: "Missing required event data"
            }
        }
        await step.run('process-transaction', async () => {
            const transaction = await db.transaction.findUnique({
                where: {
                    id: event.data.transactinId,
                    userId: event.data.userId
                },
                include: {
                    account: true
                }
            })
            if (!transaction || !isTransactionDue(transaction)) return
            await db.$transaction(async (tx) => {
                //  create new transaction
                await tx.transaction.create({
                    data: {
                        type: transaction.type,
                        amount: transaction.amount,
                        description: `${transaction.description} (Recurring)`,
                        date: new Date(),
                        category: transaction.category,
                        userId: transaction.userId,
                        accountId: transaction.accountId,
                        isRecurring: false
                    }
                })
                // update balance change
                const balanceChange = transaction.type == 'EXPENSE' ? -transaction.amount.toNumber() : transaction.amount.toNumber();
                await tx.account.update({
                    where: {
                        id: transaction.accountId
                    },
                    data: {
                        balance: { increment: balanceChange }
                    }
                })
                // update last processed date and make next recurring date
                await tx.transaction.update({
                    where: {
                        id: transaction.id
                    },
                    data: {
                        lastProcessed: new Date(),
                        nextRecurringDate: calculateNextRecurringDate(
                            new Date(),
                            transaction.recurringInterval ? transaction.recurringInterval : "MONTHLY"
                        )
                    }
                })
            });
        });
    }
)
function isTransactionDue(transaction: TTransaction) {
    // if no  lastProcessed dat, trasaction is due
    if (!transaction.lastProcessed) return true;
    const today = new Date();
    const nextDue = transaction?.nextRecurringDate ? new Date(transaction.nextRecurringDate) : new Date();
    // compare with nextDue date
    return nextDue <= today

}


export const genrateMonthlyReports = inngest.createFunction({
    id: "generate-monthly-reports",
    name: "Generate Monthly Report"

},
    {
        cron: "0 0 1 * *"
    }, async ({ step }) => {


        // fetch all user
        const users = await step.run("fetch-users", async () => {
            return await db.user.findMany({
                include: {
                    accounts: true
                }
            })
        })

        // generate report for all user
        for (const user of users) {
            await step.run(`generate-report-${user.id}`, async () => {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1)
                const stats = await getMonthlyStats(user.id, lastMonth);
                const monthName = lastMonth.toLocaleString("default", {
                    month: "long"
                });
                const insights = await generateFinancialInsights(stats, monthName)

                // Send Email

                await POST({
                    to: user.email || "",
                    subject: `Your Monthly Financial Report${monthName}`,
                    react: Emailtemplate({
                        userName: user.name || "",
                        type: "monthly-report",
                        data: {
                            stats,
                            month: monthName,
                            insights
                        }

                    })
                })
            })
        }
        return { processed: users.length }
    })


// 1.Generate mothly stats based on category
const getMonthlyStats = async (userId: string, month: Date) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const transactions = await db.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    })
    return transactions.reduce((stats: { totalExpenses: number, totalIncome: number, byCategory: { [key: string]: number }, transactionCount: number }, t) => {
        const amount = t.amount.toNumber();
        if (t.type === 'EXPENSE') {
            stats.totalExpenses += amount;
            stats.byCategory[t.category] = (stats.byCategory[t.category] || 0 + amount)
        }
        else {
            stats.totalIncome += amount
        }
        return stats
    }, {
        totalExpenses: 0,
        totalIncome: 0,
        byCategory: {},
        transactionCount: transactions.length
    })

}


// 2. Monthly Report Generation
async function generateFinancialInsights(stats: TStats, month: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
            .map(([category, amount]) => `${category}: $${amount}`)
            .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating insights:", error);
        return [
            "Your highest expense category this month might need attention.",
            "Consider setting up a budget for better financial management.",
            "Track your recurring expenses to identify potential savings.",
        ];
    }
}
