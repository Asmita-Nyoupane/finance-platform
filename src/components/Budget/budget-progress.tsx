"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Check, Pencil, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useFetch } from '@/hooks/use-fetch'
import { updateBudget } from '@/actions/budget.action'
import { toast } from 'sonner'
import { Progress } from '../ui/progress'
import { TBudget } from '@/types/global-types'


type TProps = {
    initialBudget: number | null;
    currentExpenses: number
}
const BudgetProgress = ({ initialBudget, currentExpenses }: TProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(initialBudget?.toString() || "")
    const { fn, error, loading } = useFetch<TBudget>(updateBudget)

    const percentUsed = initialBudget ? ((currentExpenses / initialBudget) * 100)
        : 0
    const handleBudgetUpdate = async () => {
        try {
            const amount = parseFloat(newBudget)
            if (isNaN(amount) || amount <= 0) {
                toast.error('Invalid Amount')
                return
            }
            await fn(amount)
            setIsEditing(false)
            toast.success('Budget Updated')
        } catch (error) {
            console.log("🚀 ~ handleBudgetUpdate ~ error:", error)
            toast.error('Failed to update budget')
        }

    }
    if (!loading && error) {
        toast.error('Failed to update budget')
    }
    const handleBudgetCancel = () => {
        setNewBudget(initialBudget?.toString() || "")
        setIsEditing(false)
    }
    return (
        <Card>
            <CardHeader className='flex-center flex-row pb-2'>
                <div className='flex-1'>
                    <CardTitle>Monthy Budget (Default Account)</CardTitle>
                    <div className=' flex items-center gap-2  mt-4'>

                        {
                            isEditing && <div className='flex gap-2 items-center'>
                                <Input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} autoFocus disabled={loading}
                                    placeholder='Enter Amount' className='w-32' />
                                <Button onClick={handleBudgetUpdate} variant={'ghost'} size={'icon'} disabled={loading} className='flex-center'>
                                    <Check className='size-4 text-green-500' />
                                </Button>
                                <Button variant={'ghost'} size={'icon'} onClick={handleBudgetCancel} disabled={loading} className='flex-center'>
                                    <X className='size-4 text-red-500' />
                                </Button>
                            </div>
                        }
                    </div>
                </div>
                <div className='flex-center gap-4'>

                    <CardDescription className=' flex  flex-row gap-2'>{initialBudget ? `$${initialBudget.toFixed(2)} of $${currentExpenses.toFixed(2)} spent` : 'No Budget set'}</CardDescription>
                    {!isEditing && <Button onClick={() => setIsEditing(true)} variant={'ghost'} size={'icon'} className='flex-center'>
                        <Pencil className='size-4 text-blue-500' />
                    </Button>}
                </div>

            </CardHeader>
            <CardContent className='space-y-2'>

                <Progress value={percentUsed ?? Number(percentUsed).toFixed(2)} className={`${percentUsed > 90 ? "bg-red-500" : (percentUsed >= 75 ? "bg-yellow-500" : "bg-green-500")}`} />

                <p className='text-left text-muted-foreground text-sm'>{percentUsed}% used</p>
            </CardContent>
        </Card>

    )
}

export default BudgetProgress
