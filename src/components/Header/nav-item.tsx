'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
const navLinks = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "Dashboard",
        // icon: "LayoutDashboard ",
        link: "/dashboard",
    },
    {
        name: "Transactions",
        link: "/transactions/create",
    },
    {
        name: "Account",
        link: "/account",
    },
];
const NavItem = () => {
    const path = usePathname()

    return (
        <div className='flex gap-10 items-center justify-center'>
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.link}
                    className={`text-lg ${path === link.link ? "text-brand  font-semibold " : " text-primary"}  hover:text-brand-foreground hover:font-semibold hover:scale-y-110 hover:transition-transform duration-300`}
                >
                    {link.name}
                </Link>
            ))}
        </div>
    )
}

export default NavItem
