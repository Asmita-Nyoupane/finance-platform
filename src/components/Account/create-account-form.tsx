
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AccountSchema, TAccountSchema } from '@/schemas/account.modal'
import React from 'react'
import { useForm } from 'react-hook-form'
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
import { AccountType } from "@prisma/client"
import { Switch } from "../ui/switch"
import { useFetch } from "@/hooks/use-fetch"
import { createAccount } from "@/actions/dasboard.action"
import { TAccount } from "@/types/global-types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { capitaliize } from "@/lib/utils"
type TProps = {
    onClose: () => void
}

const CreateAccountForm = ({ onClose }: TProps) => {
    const { data, loading, error, fn } = useFetch<TAccount>(createAccount)
    const form = useForm<TAccountSchema>({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            name: "",
            isDefault: false,
        },
    })
    const onSubmit = async (values: TAccountSchema) => {
        await fn(values); // Call the API
        if (data && !loading) {
            toast.success("New account successfully")
            onClose()
        } else {
            console.log("🚀 ~ onSubmit ~ error:", error)
        };
        toast.error(error);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Salary Account ..." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select  your Account Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        Object.values(AccountType).map((type) => (
                                            <SelectItem key={type} value={type}>{capitaliize(type)}</SelectItem>
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
                    name="balance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Balance</FormLabel>
                            <FormControl>
                                <Input placeholder="0.0" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Is this your default account?</FormLabel>

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
                <Button type="submit" disabled={loading} className="w-full text-center flex-center">{
                    loading ? < ><Loader2 className="size-4 animate-spin mr-4" />Creating Account...
                    </> : 'Create Account'
                }</Button>
            </form>
        </Form>

    )
}

export default CreateAccountForm
