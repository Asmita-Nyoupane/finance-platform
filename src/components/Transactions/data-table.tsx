"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "../ui/checkbox";
import { TTransaction } from "@/types/global-types";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { capitaliize } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
type SortConfig = {
    field: string;
    direction: string;
};

const DataTable = ({ filteredAndSortedTransaction, selectedIds, setSelectedIds, sortCofig, setSortConfig }: {
    filteredAndSortedTransaction: TTransaction[];
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    sortCofig: SortConfig;
    setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>;
}) => {
    const router = useRouter()





    const handleSort = (field: string) => {
        setSortConfig(current => ({
            field,
            direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    const handleSelect = (id: string) => {

        setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
    }
    const handleSelectAll = () => {
        setSelectedIds(current =>
            current.length === filteredAndSortedTransaction.length ? [] : filteredAndSortedTransaction.map((t) => t.id)

        )
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox onCheckedChange={handleSelectAll}
                                checked={
                                    selectedIds.length === filteredAndSortedTransaction.length && filteredAndSortedTransaction.length > 0
                                }
                            />
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("date")}
                        >
                            <div className="flex items-center">Date

                                {
                                    sortCofig.field === 'date' ? (

                                        sortCofig.direction === 'asc' ? <ChevronUp className="size-4 ml-1" /> : <ChevronDown className="size-4 ml-1" />
                                    ) : (null)
                                }
                            </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("category")}
                        >
                            <div className="flex items-center">Category
                                {
                                    sortCofig.field === 'category' ? (

                                        sortCofig.direction === 'asc' ? <ChevronUp className="size-4 ml-1" /> : <ChevronDown className="size-4 ml-1" />
                                    ) : (null)
                                }
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("amount")}
                        >
                            <div className="flex items-center justify-end"> Amount
                                {
                                    sortCofig.field === 'amount' ? (

                                        sortCofig.direction === 'asc' ? <ChevronUp className="size-4 ml-1" /> : <ChevronDown className="size-4 ml-1" />
                                    ) : (null)
                                }
                            </div>
                        </TableHead>
                        <TableHead className="flex justify-end items-center">Recurring</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="py-10">
                    {filteredAndSortedTransaction.length === 0 ? (
                        <TableRow className="col-sapn-7">
                            <TableCell className="  py-8 text-lg text-muted-foreground font-semibold">
                                {" "}
                                No Transaction found
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredAndSortedTransaction?.map((transaction) => (
                            <TableRow key={transaction.id} className="py-4">
                                <TableCell className="">
                                    <Checkbox onCheckedChange={() => handleSelect(transaction.id)}
                                        checked={selectedIds.includes(transaction.id)}
                                    />
                                </TableCell>
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
                                <TableCell className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <MoreHorizontal className="size-4 " />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel className="text-primary   flex-center cursor-pointer text-left hover:text-blue-500" onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)} >
                                                <Pencil className="size-4 mr-2" />   Edit
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="hover:text-red-500    cursor-pointer  group flex-center text-center mx-auto"
                                            //  onClick={() => deleteFn([transaction.id])}


                                            >
                                                <Trash2 className="size-4 mr-2" />   Delete
                                            </DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default DataTable;
