"use client"
import { TTransaction } from '@/types/global-types'
import React, { useMemo, useState } from 'react'
import DataTable from './data-table'
import { Input } from '../ui/input';
import { Search, Trash2, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button';



const TransactionDetails = ({ transactions }: { transactions: TTransaction[] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [sortCofig, setSortConfig] = useState({
        field: "date",
        direction: "desc"
    })
    const handleBulkDelete = () => {

    }
    const handleClearFilter = () => {
        setSearchTerm(""),
            setRecurringFilter(""),
            setTypeFilter(""),
            setSelectedIds([])
    }
    // function to filter and sort the data
    const filteredAndSortedTransaction = useMemo(() => {
        let result = transactions
        // search
        if (searchTerm) {
            const searchKey = searchTerm.toLowerCase();
            result = result.filter((trans) =>
                (trans.description?.toLowerCase() || trans.category?.toLowerCase()).includes(searchKey)
            )
        }

        //  apply recurring filter
        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === 'recurring') return transaction.isRecurring;
                return !transaction.isRecurring
            })
        }
        //  apply type filter

        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter)
        }
        // apply sorting


        result.sort((a, b) => {
            let comparision = 0;
            switch (sortCofig.field) {
                case "date":
                    comparision = new Date(a.date).getTime() - new Date(b.date).getTime()

                    break;
                case "amount":
                    comparision = Number(a.amount) - Number(b.amount)
                    break;
                case "category":
                    comparision = a.category.localeCompare(b.category)
                    break;
                default:

                    comparision = 0
            }
            return sortCofig.direction === 'asc' ? comparision : -comparision

        })
        return result


    }, [searchTerm, recurringFilter, typeFilter, selectedIds, sortCofig])
    return (
        <div className=' flex flex-col gap-10 '>
            {/* filter */}
            <section className=' flex flex-col sm:flex-row gap-6'>
                <div className='relative flexx-1'>
                    <Search className='  absolute  left-2 top-2.5 size-4 text-muted-foreground ' />
                    <Input type="text" placeholder="Search..." className="pl-7" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className='flex gap-6'>

                    <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>

                        </SelectContent>
                    </Select>
                    <Select value={recurringFilter} onValueChange={(val) => setRecurringFilter(val)} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Transaction" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recuring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-Recuring Only</SelectItem>

                        </SelectContent>
                    </Select>
                </div>
                {selectedIds.length > 0 && <Button variant={'outline'} onClick={handleBulkDelete} className=' flex-center   hover:bg-red-400' >
                    <Trash2 className='size-4 ml-2' /> Delete ({selectedIds.length})
                </Button>}

                {
                    (searchTerm || recurringFilter || typeFilter) && <Button onClick={handleClearFilter} variant={'outline'} className=" flex-center hover:bg-brand" title='Clear Filter'> <X className='size-4 ml-2' />Clear</Button>
                }
            </section>
            <div className="container mx-auto py-10">
                <DataTable filteredAndSortedTransaction={filteredAndSortedTransaction} selectedIds={selectedIds} setSelectedIds={setSelectedIds} sortCofig={sortCofig} setSortConfig={setSortConfig} />
            </div>
        </div>
    )
}

export default TransactionDetails
