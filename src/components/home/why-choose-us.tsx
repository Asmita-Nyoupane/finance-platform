import Image from 'next/image';
import React from 'react';

const WhyChooseUs = () => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 ">
            <div className=' flex-center'>

                <Image
                    src="/images/plant-grow.png"
                    alt="Plant growing"
                    height={500}
                    width={500}
                    className="object-cover rounded-lg  aspect-video  "
                />
            </div>

            <div className='flex  flex-col justify-between items-start gap-6 md:gap-8 lg:gap-10  '>

                {/* Title Section */}
                <div className="text-start">
                    <h2 className="title">
                        Why Choose <span className="text-primary">MoneyTrail</span>
                    </h2>
                </div>


                <p className=" w-full text-start text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed ">
                    At <span className="font-bold text-primary">MoneyTrail</span>, we empower you to take charge of your financial journey with ease.
                    Our platform provides cutting-edge features, AI-driven insights, and tools designed to help you stay on top of your finances.
                    Experience the simplicity and clarity that revolutionizes your money management.
                </p>
            </div>
        </div>
    );
};

export default WhyChooseUs;
