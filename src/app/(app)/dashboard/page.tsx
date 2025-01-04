
import { getAllAccounts } from '@/actions/account.action';
import { getCurrentBudget } from '@/actions/budget.action';
import { Account, MyAccount } from '@/components/Account/account';
import BudgetProgress from '@/components/Budget/budget-progress';
import { Skeleton } from '@/components/ui/skeleton';


import React, { Suspense } from 'react'

const DashboardPage = async () => {
    const accounts = await getAllAccounts();
    const defaultAccount = accounts?.find((account) => account.isDefault)
    let budgetData = null;
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id)

    }


    return (
        <div className='flex flex-col gap-10'>
            {
                defaultAccount && <Suspense fallback={<Skeleton className="w-full h-[100px] " />
                }><BudgetProgress initialBudget={budgetData?.budget?.amount || null} currentExpenses={budgetData?.currentExpenses || 0} />
                </Suspense>
            }
            <section className='flex flex-wrap gap-10'>
                <Suspense fallback={<Skeleton className="w-[100px] h-[100px] rounded" />
                }>

                    <Account />
                </Suspense>
                {!!accounts && accounts.length < 1 ? <div>No accounts found</div> :
                    accounts.map((acc) => {
                        return acc && "balance" in acc ? <Suspense fallback={<Skeleton className="w-[100px] h-[100px] rounded" />
                        }>
                            <MyAccount key={acc.id} account={{ ...acc, balance: Number(acc.balance) }} />
                        </Suspense> : null
                    })
                }
            </section>
        </div>
    )
}

export default DashboardPage
