import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';



const bannervideo = '/images/hero.mp4';

const HeroSection = () => {
    return (
        <section className="relative hero h-screen m-0 p-0">

            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={bannervideo}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-60 text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-center leading-snug">
                    Experience the Power of
                    <span className="text-brand ml-3">Precision</span>
                </h1>
                <p className="mt-4 text-center md:text-xl w-6/12">
                    Manage, track, and grow your finances effortlessly with MoneyTrail.
                </p>

                <div className="flex space-x-4 mt-6">
                    {/* Primary Button */}
                    <Button asChild
                        className=" rounded-full flex items-center bg-transparent border border-brand hover: bg-brand hover:border-white group"
                        size="lg"
                    >
                        <Link href={'/dashboard'}>Start Now <MoveRight className='size-4 ml-1 font-bold roup-hover:translate-x-4 transform transition-all duration-300 ease-in-out' />
                        </Link>
                    </Button>


                </div>
            </div>
        </section>
    );
};

export default HeroSection;
