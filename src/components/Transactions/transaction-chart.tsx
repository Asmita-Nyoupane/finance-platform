"use client"
import { TTransaction } from '@/types/global-types'
import React, { useMemo, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DATE_RANGE } from '@/lib/constants';
import { endOfDay, format, subDays } from 'date-fns';
type TProps = {
    transactions: TTransaction[]
}
export type TDateRange = { [key: string]: { label: string, days: number | null } }
const TransactionChart = ({ transactions }: TProps) => {
    const [dateRange, setDateRange] = useState<string>('1M');
    const filteredTransactions = useMemo(() => {

        const range = DATE_RANGE[dateRange];

        const now = new Date();
        const startDate = range.days !== null ? subDays(now, range.days as number) : new Date(0);

        const filtered = transactions.filter((transaction) => new Date(transaction.date) >= startDate && new Date(transaction.date) <= endOfDay(now))


        const grouped = filtered.reduce((acc, transaction) => {

            const date = format(new Date(transaction.date), 'MMM dd')
            if (!acc[date]) {
                acc[date] = { date, income: 0, expense: 0 }
            }
            if (transaction.type === 'INCOME') {
                acc[date].income += Number(transaction.amount)
            }
            else {
                acc[date].expense += Number(transaction.amount)
            }
            return acc
        }, {

        } as Record<string, { date: string, income: number, expense: number }>)
        // convert tp array and sort by date
        return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    }, [transactions, dateRange])

    const totalIncome = useMemo(() => {
        return filteredTransactions.reduce((acc, transaction) => ({
            income: acc.income + transaction.income,
            expense: acc.expense + transaction.expense
        }), { income: 0, expense: 0 })
    }, [filteredTransactions])
    return (

        <Card>
            <CardHeader className='flex  flex-row justify-between items-center'>
                <CardTitle className='subtitle' >Transaction OverView</CardTitle>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(DATE_RANGE).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value.label}</SelectItem>))}
                    </SelectContent>
                </Select>

            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <div className='flex justify-evenly gap-4 items-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-muted-foreground'>Total Income</p>
                        <p className='font-bold text-green-500'>${totalIncome.income.toFixed(2)}</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-muted-foreground'>Total Expense</p>
                        <p className='font-bold text-red-500'>${totalIncome.expense.toFixed(2)}</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-muted-foreground'>Net</p>
                        <p className={`font-bold ${(totalIncome.income > totalIncome.expense) ? "text-green-500" : "text-red-500"}`}>${(totalIncome.income - totalIncome.expense).toFixed(2)}</p>
                    </div>
                </div>
                <div className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredTransactions}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => `$${value}`}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip formatter={(value: number) => [`$${value}`, undefined]} />
                            <Legend />
                            <Bar dataKey="income" fill="#19ac22" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#c6434b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

    )
}

export default TransactionChart
