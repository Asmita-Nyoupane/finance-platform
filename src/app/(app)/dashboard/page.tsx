
import { getAllAccounts } from '@/actions/account.action';
import { getCurrentBudget } from '@/actions/budget.action';
import { getDashboarData } from '@/actions/dasboard.action';
import { Account, MyAccount } from '@/components/Account/account';
import BudgetProgress from '@/components/Budget/budget-progress';
import DashboardOverview from '@/components/Transactions/dashboard-overview';
import { Skeleton } from '@/components/ui/skeleton';


import React, { Suspense } from 'react'

const DashboardPage = async () => {
    const accounts = await getAllAccounts();
    const defaultAccount = accounts?.find((account) => account.isDefault)
    let budgetData = null;
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id)

    }
    const transactions = await getDashboarData()



    return (
        <div className='flex flex-col gap-10'>
            {
                defaultAccount && <Suspense fallback={<Skeleton className="w-full h-[100px] " />
                }><BudgetProgress initialBudget={budgetData?.budget?.amount || null} currentExpenses={budgetData?.currentExpenses || 0} />
                </Suspense>
            }




            <Suspense fallback={<Skeleton className="w-[100px] h-[100px] rounded grid grid-cols-1 lg:grid-cols-2 gap-10" />
            }>
                <DashboardOverview transactions={transactions || []} accounts={accounts} />

            </Suspense>
            <section>

                <h2 className='  text-xl lg:text-3xl font-bold lg:font-extrabold text-brand  my-6'>My Accounts</h2>
                <div className='flex flex-wrap gap-10'>
                    <Account />
                    {!!accounts && accounts.length < 1 ? <div>No accounts found</div> :
                        accounts.map((acc) => {
                            return acc && "balance" in acc ? <Suspense fallback={<Skeleton className="w-[100px] h-[100px] rounded" />
                            }>
                                <MyAccount key={acc.id} account={{ ...acc, balance: Number(acc.balance) }} />
                            </Suspense> : null
                        })
                    }
                </div>
            </section>

        </div>
    )
}

export default DashboardPage

