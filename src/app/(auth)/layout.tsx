import React from 'react'

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className=' fixed inset-0 flex justify-center items-center overflow-y-hidden '>
            {children}
        </div>
    )
}

export default AuthLayout
