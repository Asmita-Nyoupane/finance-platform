
import { getAllAccounts } from '@/actions/account.action';
import { Account, MyAccount } from '@/components/Account/account';


import React from 'react'

const DashboardPage = async () => {
    const accounts = await getAllAccounts();

    return (
        <div className='flex flex-col gap-10'>
            Dashboard page
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
