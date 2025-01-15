
import { getAccountWithTranaction } from '@/actions/account.action'
import Custom404 from '@/app/not-found'
import { ChartSkeleton, HeaderSkeleton, TransactionDetailsSkeleton } from '@/components/Account/account-skeleton'
import NavigateBack from '@/components/Global/navigate-back'
const TransactionChart = React.lazy(() => (import('@/components/Transactions/transaction-chart')))
const TransactionDetails = React.lazy(() => (import('@/components/Transactions/transaction-detail')))
import { capitaliize } from '@/lib/utils'
import { TAccountWithTransactions } from '@/types/global-types'
import React, { Suspense } from 'react'
type TProps = {
    params?: Promise<{
        id?: string;
    }>;
};
const SingleAccountPage = async ({ params }: TProps) => {

    const resolvedParams = await params; // Await the `params` Promise
    const accountId = resolvedParams?.id;
    if (!params || !accountId) return <Custom404 />
    const accountData = await getAccountWithTranaction(accountId)
    if (!accountData || !accountData.transactions) return <Custom404 />
    const { transactions, ...account } = accountData as TAccountWithTransactions

    return (
        <div className='flex  flex-col gap-10 container mx-auto px-4 my-6'>
            <Suspense fallback={<HeaderSkeleton />}>

                <section className='flex flex-col gap-1'>
                    <div className='flex justify-between items-end mb-3'>

                        <h2 className='title capitalize '>{account.name}</h2>
                        <p className='subtitle font-bold'> ${account.balance.toFixed(3)}</p>
                    </div>
                    <div className='flex justify-between items-end mb-3'>
                        <div className='space-y-2'>

                            <p className='text-muted-foreground font-semibold flex items-center'> Account Type : {capitaliize(account.type)}</p>
                            <NavigateBack />
                        </div>
                        <p className='text-muted-foreground '>{account._count.transactions} Transactions</p>
                    </div>
                </section>

            </Suspense>
            <Suspense fallback={< ChartSkeleton />
            }>

                <TransactionChart transactions={(!!transactions && transactions?.length > 0) ? transactions : []} />
            </Suspense>
            <Suspense fallback={
                <TransactionDetailsSkeleton />

            }>
                <TransactionDetails transactions={(!!transactions && transactions?.length > 0) ? transactions : []} />
            </Suspense>
        </div>
    )
}

export default SingleAccountPage
