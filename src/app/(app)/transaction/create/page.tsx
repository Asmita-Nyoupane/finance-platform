import { getAllAccounts } from '@/actions/account.action';
import CreateTransactionForm from '@/components/Transactions/create-transaction-form'
import { defaultCategories } from '@/data/category';
import React from 'react'

const CreateTransactionPage = async () => {
    const accounts = (await getAllAccounts()).map(account => ({
        ...account,
        balance: Number(account.balance)
    }));

    return (
        <div className='container mx-auto px-4 my-6 flex flex-col gap-10'>

            <header className='title text-center'>Create New Transaction</header>
            <CreateTransactionForm accounts={accounts} categories={defaultCategories} />
        </div>
    )
}

export default CreateTransactionPage
