'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';
import { navLinks } from './nav-item';

const BottomNav = () => {
    const path = usePathname()

    return (
        <div className=' fixed  z-50 bottom-0 bg-secondary w-full h-14 overflow-hidden md:hidden'>
            <div className='flex  items-center justify-evenly h-full  '>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.link}
                        className={`text-lg ${path === link.link ? "text-brand  font-bold " : " text-primary"}  hover:text-brand-foreground hover:font-semibold hover:scale-y-110 hover:transition-transform duration-300`}
                    >

                        {/* Show Button and Icon only on medium and larger screens */}
                        <Button
                            className={`text-lg   flex md:hidden items-center gap-2${path === link.link ? "text-brand  font-bold " : " text-primary"}`}
                            variant={`${link.link === "/transaction/create" ? "outline" : "ghost"}`}

                        >
                            <link.icon className="w-5 h-5" />
                            <span className='text-base'>{link.name}</span>
                        </Button>


                    </Link>
                ))}
            </div>
        </div>

    )
}

export default BottomNav
