import Features from "@/components/home/features";
import TransformJourney from "@/components/home/transform";
import HowItWorks from "@/components/home/how-it-work";

import WhyChooseUs from "@/components/home/why-choose-us";
import HeroSection from "@/components/home/hero-section";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {
  return (
    <div className=" flex flex-col gap-10 md:gap-20 ">
      <Suspense fallback={<Skeleton className="w-[100px] h-[200px] rounded" />
      }>

        <HeroSection />
      </Suspense>
      <div className="container mx-auto px-4 my-6 flex flex-col  gap-10 md:gap-20">

        <Features />
        <WhyChooseUs />
        <HowItWorks />
        <TransformJourney />
      </div>
    </div>
  );
}
