import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import DashboardPage from './page'

const DashboardLayout = () => {
    return (
        <div className='flex flex-col  space-y-10 '>
            <header className='title'>Dashboard</header>
            <Suspense fallback={
                <BarLoader
                    color={'brand-foreground'}
                    width={'100%'}
                    height={4}
                    loading={true}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />}>
                <DashboardPage />
            </Suspense>
        </div>
    )
}

export default DashboardLayout
