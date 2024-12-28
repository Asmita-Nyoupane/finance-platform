import React from 'react'

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='flex-center pt-10'>
            {children}
        </div>
    )
}

export default AuthLayout
