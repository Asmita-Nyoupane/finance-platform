import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const TransformJourney = () => {
    return (
        <div className=" flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-12">
            {/* Left Content: Intro Section */}
            <div className=" flex flex-col gap-8 text-center md:text-left  w-full md:w-[50%] ">
                <header className="text-3xl md:text-5xl font-bold leading-tight">
                    Transform Your <span className="text-brand">Financial Future
                    </span> Today!
                </header>
                <p className=" text-md md:text-lg">
                    Take the first step toward smarter money management with MoneyTrail.
                    👉 Sign up now and experience the future of personal finance.

                    Have questions? Our team is here to help. Reach out to us anytime!
                </p>
                <Link href="/sign-up">
                    <Button variant="outline" size={'lg'} className="rounded-full flex items-center">
                        Sign Up <MoveRight className="size-4 ml-2 text-brand-foreground text-bold" />
                    </Button>
                </Link>

            </div>

            {/* Center Content: Animated Image */}
            <div className="relative flex justify-center items-center  w-auto md:w-1/2">
                <Image
                    src="/images/ai.jpg"
                    alt="AI with money"
                    height={500}
                    width={500}
                    className=" aspect-square object-contained rounded-lg shadow-lg hover:scale-110  transition-all duration-300 ease-in-out"
                />
                {/* <h2 className="absolute top-0  text-xl md:text-2xl font-semibold text-white bg-black/60 px-4 py-2 rounded-md animate-fadeIn">
                    Your Smart Finance Partner
                </h2> */}
            </div>


        </div>
    );
};

export default TransformJourney;
