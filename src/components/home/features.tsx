import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { keyFeatures } from '@/data/home-data'



const Features = () => {
    return (
        <div className=' flex flex-col justify-between gap-10 items-center'>
            <div className="text-center">
                <h2 className="title ">
                    Key <span className="text-primary">Features</span>
                </h2>
                <p className="subtitle text-muted-foreground mt-4 text-lg">
                    Discover the standout features that make our platform unique and impactful.
                </p>
            </div>

            <div className='flex-center  flex-row flex-wrap gap-10'>
                {
                    keyFeatures.map((feature, i) => (
                        <Card key={i} className='w-[400px]  h-[240px] hover:scale-105 duration-500 ease-in-out transition-all hover:bg-primary-foreground '>
                            <CardHeader>
                                <CardTitle className='subtitle text-center leading-8'>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-left text-muted-foreground'>{feature.description}</p>
                            </CardContent>

                        </Card>

                    ))
                }
            </div>
        </div>
    )
}

export default Features
