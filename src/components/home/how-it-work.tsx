import { howItWorks } from "@/data/home-data";
import React from "react";
import { Card } from "../ui/card";

const HowItWorks = () => {
    return (
        <div className="flex flex-col items-center gap-8 p">
            {/* Heading Section */}
            <div className="text-center">
                <h2 className="title ">
                    How It <span className="text-primary">Works</span>
                </h2>
                <p className=" mt-2 text-muted-foreground text-lg">
                    Follow these simple steps to make the most out of MoneyTrail.
                </p>
            </div>

            {/* Steps Section */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-12 justify-center items-center ">
                {howItWorks.map((item, index) => (
                    <Card
                        key={index}
                        className="step-card w-full md:w-[300px] lg:w-[320px]  h-auto  shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        <div className="step-number w-12 h-12 flex items-center justify-center bg-primary-foreground text-primary-background rounded-full text-lg font-bold mb-4">
                            {index + 1}
                        </div>
                        <h3 className="subtitle  text-primary mb-2">
                            {item.step}
                        </h3>
                        <p className="step-description text-muted-foreground  leading-relaxed">
                            {item.description}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
