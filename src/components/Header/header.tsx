"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const Header = () => {
    const { setTheme, theme } = useTheme()
    const isDark = theme === 'dark'
    return (
        <div className='sticky top-0 z-50 w-full bg-muted backdrop-blur-md border-b'>
            <nav className=' container mx-auto flex justify-between items-center p-4'>

                <Link href='/'>
                    <Image src="/logo.png" alt="logo" width={100} height={100} className='h-12 w-auto object-contain' />
                </Link>
                <div className='flex gap-5 md:gap-8 items-center'>


                    <SignedOut>
                        <SignInButton forceRedirectUrl={'/dashboard'} >
                            <Button >
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>


                    <div className={` flex items-center cursor-pointer  transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`} onClick={() => setTheme(isDark ? "light" : "dark")}>
                        {
                            isDark ?
                                <Sun className="size-5 rotate-0 transition-all text-orange-600" /> :
                                <Moon className="size-5 git init rotate-0 transition-all text-blue-700" />
                        }
                    </div>
                </div>
            </nav>
        </div >
    )
}

export default Header
