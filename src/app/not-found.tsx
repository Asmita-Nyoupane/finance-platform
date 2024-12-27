"use client"
import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Custom404 = () => {
    const theme = useTheme()
    const dark = theme.theme === 'dark'
    return (
        <div className="flex h-screen w-full flex-col  gap-5 items-center justify-center">
            {dark ? <div className="flex-center space-x-4 text-brand-foreground">
                <Frown size={50} className="text-brand-foreground" />
                <h1 className="title">404</h1>
            </div> :
                <Image src={"/not-found.png"} alt='not found image' height={300} width={300} className='object-cover'
                />}
            <p className="text-xl text-muted-foreground">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <Link href="/">
                <Button
                    size='lg'
                >
                    Go Back to Home
                </Button>
            </Link>
        </div>
    );
};

export default Custom404;
