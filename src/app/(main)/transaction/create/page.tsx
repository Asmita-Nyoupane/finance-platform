import { getAllAccounts } from '@/actions/account.action';
import { getTransaction } from '@/actions/transaction.action';
import CreateTransactionForm from '@/components/Transactions/create-transaction-form'
import { Skeleton } from '@/components/ui/skeleton';
import { defaultCategories } from '@/data/category';
import { TransactionStatus, TransactionType } from '@prisma/client';
import React, { Suspense } from 'react'
type TProps = {
    searchParams?: Promise<{ edit: string }>
};


const CreateTransactionPage = async ({ searchParams }: TProps) => {


    const resolvedSearchParams = await searchParams;
    const editedId = resolvedSearchParams?.edit;
    const accounts = (await getAllAccounts()).map(account => ({
        ...account,
        balance: Number(account.balance)
    }));


    let initialData = {
        amount: 0,
        id: '',
        type: 'INCOME' as TransactionType,
        category: '',
        isRecurring: false,
        userId: '',
        accountId: '',
        description: '',
        status: 'COMPLETED' as TransactionStatus,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    if (editedId) {
        const transaction = await getTransaction(editedId);
        initialData = {

            ...transaction,
            amount: Number(transaction.amount),
            type: transaction.type as TransactionType,
            description: transaction.description ?? '',
            category: transaction.category ?? '',

        }
    }

    return (
        <div className=' w-11/12 md:w-10/12 lg:w-8/12 mx-auto px-4 my-14 flex flex-col gap-10'>

            <header className='title text-center'>{!!editedId ? "Edit Transaction" : "Create New Transaction"
            }</header>
            <Suspense fallback={
                <Skeleton className="w-full h-[500px] rounded" />

            }>

                <CreateTransactionForm accounts={accounts} categories={defaultCategories}

                    editedId={!!editedId}
                    initialData={initialData}
                />
            </Suspense>

        </div>
    )
}

export default CreateTransactionPage
