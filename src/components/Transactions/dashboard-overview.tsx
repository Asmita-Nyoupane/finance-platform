"use client"
import { TAsycncAccount, TTransaction } from '@/types/global-types'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { format } from 'date-fns'
import { categoryColors } from '@/data/category'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Clock, RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { capitaliize } from '@/lib/utils'
import { Cell, DefaultTooltipContent, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { COLORS } from '@/lib/constants'


type TProps = {
    transactions: TTransaction[],
    accounts: TAsycncAccount[]

}

const DashboardOverview = ({ transactions, accounts }: TProps) => {
    const [selectedId, setSelectedId] = useState(
        accounts.find((acc) => acc.isDefault)?.id
    )
    const filteredTransaction = transactions.filter((transaction) => transaction.accountId === selectedId)
    //  get 5 recent transaction in ascending order of date
    const recentTransactions = filteredTransaction.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    // get current date
    const currentDate = new Date();
    // filter curreent month expenses
    const currentMonthExpenses = filteredTransaction.filter((t) => {
        const transactionDate = new Date(t.date)
        return (
            t.type === 'EXPENSE' &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
        )
    })

    //  group expenses by category

    const expensesByCategory = currentMonthExpenses.reduce((acc: { [key: string]: number }, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
    }, {} as { [key: string]: number });


    //  Format data for pie chart
    const pieChartsData = Object.entries(expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount
    }))

    return (
        <div className=' grid grid-cols-1 lg:grid-cols-2 gap-10'>

            <Card>
                <CardHeader>
                    <div className='flex justify-between  items-center'>
                        <CardTitle className='subtitle'>Recent Trasactions</CardTitle>
                        <Select onValueChange={setSelectedId} defaultValue={selectedId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts?.map((account: TAsycncAccount, i) =>
                                    <SelectItem key={i} value={account.id}>{account.name}</SelectItem>)}

                            </SelectContent>
                        </Select>

                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead


                                >
                                    <div className="flex items-center">Date


                                    </div>
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead

                                >
                                    <div className="flex items-center">Category

                                    </div>
                                </TableHead>
                                <TableHead


                                >
                                    <div className="flex items-center justify-end"> Amount

                                    </div>
                                </TableHead>
                                <TableHead className="flex justify-end items-center">Recurring</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody className="py-10">
                            {recentTransactions.length === 0 ? (
                                <TableRow >
                                    <TableCell colSpan={7} className=" py-16 text-lg text-muted-foreground font-semibold text-center">
                                        {" "}
                                        No Transaction found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentTransactions?.map((transaction) => (
                                    <TableRow key={transaction.id} className="py-4">

                                        <TableCell>
                                            {" "}
                                            {format(new Date(transaction.date), "PP")}
                                        </TableCell>
                                        <TableCell>
                                            {" "}
                                            <span className="max-w-[150px] text-wrap overflow-y-scroll">
                                                {transaction.description}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className=" my-2  py-2 px-4 rounded-lg text-white capitalize"
                                                style={{ background: categoryColors[transaction.category] }}
                                            >
                                                {transaction.category}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-semibold ${transaction.type === "EXPENSE"
                                                ? "text-red-500"
                                                : "text-green-600"
                                                }`}
                                        >
                                            {transaction.type === "EXPENSE" ? "-$" : "+$"}
                                            <span className="ml-1">{transaction.amount.toFixed(2)}</span>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.isRecurring ? (
                                                <div className="flex items-center justify-end">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant={'outline'} className="flex items-center cursor-pointer  text-purple-400 hover:text-purple-500 transition-all duration-300 ease-in-out">
                                                                    <RefreshCcw className="size-4 mr-1" />
                                                                    {transaction.recurringInterval && capitaliize(transaction.recurringInterval)}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="border shadow rounded">
                                                                <h2 className="text-md font-medium"></h2>
                                                                Next Date:   <p className="text-muted-foreground">
                                                                    {" "}
                                                                    {transaction.nextRecurringDate &&
                                                                        format(
                                                                            new Date(transaction.nextRecurringDate),
                                                                            "pp"
                                                                        )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            ) : (
                                                <div className="flex py-2 items-center justify-end ">
                                                    <Clock className="size-4 mr-2" />
                                                    One Time
                                                </div>
                                            )}
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

            </Card>
            <Card className=' flex-1'>
                <CardHeader>
                    <CardTitle>
                        Monthly Expenses Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pieChartsData.length === 0 ? <p className=' text-center text-muted py-4'>
                        No expenses in this month
                    </p> :
                        <div style={{ width: '100%', height: 400 }}>

                            <ResponsiveContainer >
                                <PieChart >
                                    <Pie
                                        data={pieChartsData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${capitaliize(name)}:$${value.toFixed(2)}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <DefaultTooltipContent
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--popover))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "var(--radius)",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </CardContent>
            </Card>
        </div>

    )
}

export default DashboardOverview
