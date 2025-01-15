'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { House, LayoutDashboard, SquarePen } from 'lucide-react';
import { Button } from '../ui/button';
export const navLinks = [
    {
        name: "Home",
        icon: House,
        link: "/"
    },
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        link: "/dashboard",
    },
    {
        name: " Create Transaction",
        icon: SquarePen,
        link: "/transaction/create",
    },

];
const NavItem = () => {
    const path = usePathname()

    return (
        <div className='flex gap-5 items-center justify-center'>
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.link}
                    className={`text-lg ${path === link.link ? "text-brand  font-bold " : " text-primary"}  hover:text-brand-foreground hover:font-semibold hover:scale-y-110 hover:transition-transform duration-300`}
                >

                    {/* Show Button and Icon only on medium and larger screens */}
                    <Button
                        className={`text-lg  hidden  md:flex items-center gap-2${path === link.link ? "text-brand  font-bold " : " text-primary"}`}
                        variant={`${link.link === "/transaction/create" ? "outline" : "ghost"}`}

                    >
                        <link.icon className="w-5 h-5" />
                        <span className='text-base'>{link.name}</span>
                    </Button>

                    {/* Show Text Only on Small Screens
                    <span className="md:hidden text-md">{link.name}</span> */}
                </Link>
            ))}
        </div>
    )
}

export default NavItem
