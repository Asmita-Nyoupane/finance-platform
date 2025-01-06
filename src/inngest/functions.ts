import { db } from "@/lib/prisma";
import { inngest } from "./client";
console.log("Registering function:");
export const checkBudgetalert = inngest.createFunction(
    { id: "check-budget-alert", name: "Check Budget Alert" },
    { cron: "0 */6 * * *" },

    async ({ step }) => {
        const budgets = await step.run("fetch-budget", async () => {
            console.log("🚀 ~ budgets ~ budgets:", budgets)
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
                const budgetAmount = budget.amount;
                const percentUsed = (totalExpenses / Number(budgetAmount)) * 100;

                if (percentUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {
                    // send email to user
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
console.log("🚀 ~ checkBudgetalert:", checkBudgetalert)
function isNewMonth(lastAlertDate: Date, currentDate: Date) {

    return (
        lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
}
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);