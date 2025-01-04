import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import DashboardPage from './page'
import Loader from '@/app/loader'

const DashboardLayout = () => {
    return (
        <div className='flex flex-col  space-y-10  container mx-auto px-4 my-6'>
            <header className='title'>Dashboard</header>
            <Suspense fallback={<Loader />}>
                <DashboardPage />
            </Suspense>
        </div>
    )
}

export default DashboardLayout
