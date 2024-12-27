"use client"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const ToggleTheme = () => {
    const { setTheme, theme } = useTheme()
    const isDark = theme === 'dark'
    return (
        <div className={` flex items-center cursor-pointer  transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`} onClick={() => setTheme(isDark ? "light" : "dark")}>
            {
                isDark ?
                    <Sun className="size-5 rotate-0 transition-all text-orange-600" /> :
                    <Moon className="size-5 git init rotate-0 transition-all text-blue-700" />
            }
        </div>
    )
}

export default ToggleTheme
