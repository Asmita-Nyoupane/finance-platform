
import { getAllAccounts } from '@/actions/account.action';
import { getCurrentBudget } from '@/actions/budget.action';
import { Account, MyAccount } from '@/components/Account/account';
import BudgetProgress from '@/components/Budget/budget-progress';


import React from 'react'

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
                defaultAccount && <BudgetProgress initialBudget={budgetData?.budget?.amount || null} currentExpenses={budgetData?.currentExpenses || 0} />
            }
            <section className='flex flex-wrap gap-10'>

                <Account />
                {!!accounts && accounts.length < 1 ? <div>No accounts found</div> :
                    accounts.map((acc) => {
                        return acc && "balance" in acc ? <MyAccount key={acc.id} account={{ ...acc, balance: Number(acc.balance) }} /> : null
                    })
                }
            </section>
        </div>
    )
}

export default DashboardPage
