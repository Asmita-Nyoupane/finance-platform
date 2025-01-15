import React from 'react'

const Footer = () => {
    return (
        <footer className=" py-8 hidden  md:flex justify-center items-center bg-primary-foreground text-primary-background border border-t-2 mt-10">
            <p>&copy; {new Date().getFullYear()} Money Trail. All rights reserved.</p>

        </footer>
    )
}

export default Footer
