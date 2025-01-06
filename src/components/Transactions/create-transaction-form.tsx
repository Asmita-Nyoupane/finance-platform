"use client"
import { TCategory } from '@/data/category'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { TAsycncAccount, TTransaction } from '@/types/global-types'
import React from 'react'
import { useFetch } from '@/hooks/use-fetch'
import { createTransaction } from '@/actions/transaction.action'
import { useForm } from 'react-hook-form'
import { TransactionSchema, TTransactionSchema } from '@/schemas/transaction.modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { RecurringInterval, TransactionType } from '@prisma/client'
import { capitaliize, cn } from '@/lib/utils'
import { Switch } from '../ui/switch'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Textarea } from '../ui/textarea'

type TModifiedAsyncAccount = Omit<TAsycncAccount, 'amount' | 'balance'> & {
    balance: number;
};
type TProps = {
    accounts: TModifiedAsyncAccount[],
    categories: TCategory[]
}

const CreateTransactionForm = ({ accounts, categories }: TProps) => {
    const router = useRouter()
    const { data, loading, error, fn } = useFetch<TTransaction>(createTransaction)
    const form = useForm<TTransactionSchema>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            isRecurring: false
        },
    })
    const onSubmit = async (values: TTransactionSchema) => {
        try {
            await fn(values);
            if (data && !loading) {
                toast.success("New transaction successfully")
                router.back()
            } else {
                console.log("🚀 ~ onSubmit ~ error:", error)
                toast.error(error);
            }

        } catch (error: any) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error(error);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-col-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select  Transaction Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(TransactionType).map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))
                                        }


                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose Catgory" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(categories).map((category) => (
                                                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                            ))
                                        }


                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter amount " {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Choose Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Account" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(accounts).map((account) => (
                                                <SelectItem key={account.id} value={account.id}>{capitaliize(account.name)}</SelectItem>
                                            ))
                                        }


                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Write something about your transaction" {...field} cols={5} value={field.value ?? ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Select Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl className=' flex items-center'>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ?? undefined}
                                            onSelect={field.onChange}

                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="isRecurring"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between ">
                                <div className="space-y-0.5">
                                    <FormLabel>Is transaction Recurring?</FormLabel>

                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}

                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {
                    form.getValues("isRecurring") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="nextRecurringDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Select  Next Recurring Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl className=' flex items-center'>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={field.onChange}

                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="recurringInterval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recurring Interval</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue='Select Recurring Interval'>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose  Recurring Interval" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(RecurringInterval).map((interval) => (
                                                        <SelectItem key={interval} value={interval}>{capitaliize(interval)}</SelectItem>
                                                    ))
                                                }


                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )
                }
                <Button type="submit" disabled={loading} className="w-full text-center flex-center">{
                    loading ? < ><Loader2 className="size-4 animate-spin mr-4" />Creating Account...
                    </> : 'Create Account'
                }</Button>
            </form>
        </Form>
    )
}

export default CreateTransactionForm
