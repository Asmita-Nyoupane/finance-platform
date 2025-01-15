const BudgetProgress = React.lazy(() => import('@/components/Budget/budget-progress'));
const DashboardOverview = React.lazy(() => import('@/components/Transactions/dashboard-overview'));
const Account = React.lazy(() => import("@/components/Account/account"));
const MyAccount = React.lazy(() => import("@/components/Account/my-account"));
import { getAllAccounts } from "@/actions/account.action";
import { getCurrentBudget } from "@/actions/budget.action";
import { getDashboarData } from "@/actions/dasboard.action";
import { Skeleton } from "@/components/ui/skeleton";


import React, { Suspense } from "react";

const DashboardPage = async () => {
    const accounts = await getAllAccounts();
    const defaultAccount = accounts?.find((account) => account.isDefault);
    let budgetData = null;
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
    }
    const transactions = await getDashboarData();

    return (
        <div className="flex flex-col gap-10">
            {defaultAccount && (
                <Suspense
                    fallback={
                        <div className=" w-full h-">
                            <Skeleton className="rounded" />
                        </div>
                    }
                >
                    <BudgetProgress
                        initialBudget={budgetData?.budget?.amount || null}
                        currentExpenses={budgetData?.currentExpenses || 0}
                    />
                </Suspense>
            )}

            <Suspense
                fallback={
                    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Skeleton className="w-[100px] h-[100px] rounded" />
                    </div>
                }
            >
                <DashboardOverview
                    transactions={transactions || []}
                    accounts={accounts}
                />
            </Suspense>
            <Suspense
                fallback={
                    <div className=" grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <Skeleton className=" rounded" />
                    </div>
                }
            >
                <section>
                    <h2 className="  text-xl lg:text-3xl font-bold lg:font-extrabold text-brand  my-6">
                        My Accounts
                    </h2>
                    <div className="flex flex-wrap gap-10">
                        <Account />
                        {!!accounts && accounts.length < 1 ? (
                            <div>No accounts found</div>
                        ) : (
                            accounts.map((acc) => {
                                return (
                                    acc &&
                                    "balance" in acc && (
                                        <MyAccount
                                            key={acc.id}
                                            account={{ ...acc, balance: Number(acc.balance) }}
                                        />
                                    )
                                );
                            })
                        )}
                    </div>
                </section>
            </Suspense>
        </div>
    );
};

export default DashboardPage;
