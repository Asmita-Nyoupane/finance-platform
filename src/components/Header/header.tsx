import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import ToggleTheme from "./toggle-theme";
import { checkUser } from "@/lib/check-user";
import NavItem from "./nav-item";



const Header = async () => {
    await checkUser();
    return (
        <div className="sticky top-0 z-50  bg-primary-foreground 6rem  w-full shadow-lg backdrop-blur-md border-b">
            <nav className=" container mx-auto flex justify-between items-center p-4">
                <Link href="/">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={200}
                        height={60}
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                <NavItem />

                <div className="flex  gap-5 items-center  justify-center">
                    <SignedOut>
                        <SignInButton>
                            <Button size={'lg'} className=" border-brand-foreground text-brand hover:text-white hover:bg-brand hover:border-none rounded-full shadow" variant={'outline'}>Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    AvatarBox: "size-12",
                                },
                            }}
                        />
                    </SignedIn>

                    <ToggleTheme />
                </div>

            </nav>
        </div>
    );
};

export default Header;
