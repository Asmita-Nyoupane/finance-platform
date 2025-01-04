"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { MoveLeft } from 'lucide-react'

const NavigateBack = () => {
    const router = useRouter()
    const handleBackward = () => {
        router.back()
    }
    return (

        <Button onClick={handleBackward} variant={'outline'} size={'icon'} className='flex-center'><MoveLeft className='size-4' /></Button>

    )
}

export default NavigateBack
