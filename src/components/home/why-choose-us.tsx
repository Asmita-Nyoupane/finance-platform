import Image from 'next/image';
import React from 'react';

const WhyChooseUs = () => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10  ">

            <Image
                src="/images/plant-grow.png"
                alt="Plant growing"
                height={300}
                width={300}
                className="object-cover rounded-lg  aspect-video w-full  "
            />


            <div className=' space-y-8 '>

                <h2 className="title">
                    Why Choose <span className="text-primary">MoneyTrail</span>
                </h2>



                <p className=" w-full text-start text-sm md:text-base lg:text-lg text-muted-foreground  tracking-wide leading-relaxed ">
                    MoneyTrail is your ultimate financial companion, designed to simplify and enhance how you manage your money. With features like multiple account management, AI-powered bill scanning, and budget alerts, we empower you to take control of your finances effortlessly. Our platform combines cutting-edge technology with robust security, ensuring your data stays private and protected. Whether you're budgeting for a goal, tracking daily expenses, or managing business finances, MoneyTrail provides a seamless, reliable, and intuitive solution tailored to your needs. Choose MoneyTrail and make every dollar count!
                </p>
            </div>
        </div>
    );
};

export default WhyChooseUs;
