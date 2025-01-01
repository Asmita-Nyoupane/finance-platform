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
import { useFetch } from '@/hooks/use-fetch';
import { bulkDeleteTransactions } from '@/actions/account.action';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import CustomAlertDialogConfirmation from '../Global/custom-alert';
import TablePagination from './pagination';
import { LIMIT } from '@/lib/constants';



const TransactionDetails = ({ transactions }: { transactions: TTransaction[] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [sortCofig, setSortConfig] = useState({
        field: "date",
        direction: "desc"
    })
    const [page, setPage] = useState(1)
    const { loading, fn } = useFetch(bulkDeleteTransactions)
    const handleBulkDelete = async () => {
        try {
            await fn(selectedIds)
            setSelectedIds([])

            toast.success('Transactions deleted successfully')

        } catch (error) {
            toast.error('Error deleting transactions')
        }
    }
    const totalPage = Math.ceil(transactions.length / LIMIT)

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
        <div className=' flex flex-col gap-6 '>
            {loading && <BarLoader loading={loading} color='#e5466b' className='w-full -mb-' width={"100%"} />}
            {/* filter */}
            <section className=' flex flex-col sm:flex-row gap-6'>
                <div className='relative flex-1'>
                    <Search className='  absolute  left-2 top-2.5 size-4 text-muted-foreground ' />
                    <Input type="text" placeholder="Search..." className="pl-7 " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                {selectedIds.length > 0 && <CustomAlertDialogConfirmation trigger={<Button variant={'outline'} className=' flex-center   hover:bg-red-400' >
                    <Trash2 className='size-4 ml-2' /> Delete ({selectedIds.length})
                </Button>}

                    onConfirm={handleBulkDelete} description={`Are you sure you want to delete ${selectedIds.length} transactions?`}
                />}

                {
                    (searchTerm || recurringFilter || typeFilter) && <Button onClick={handleClearFilter} variant={'outline'} className=" flex-center hover:bg-brand" title='Clear Filter'> <X className='size-4 ml-2' />Clear</Button>
                }
            </section>
            <div className="container mx-auto py-10">
                <DataTable filteredAndSortedTransaction={filteredAndSortedTransaction.slice(page, page + LIMIT)} selectedIds={selectedIds} setSelectedIds={setSelectedIds} sortCofig={sortCofig} setSortConfig={setSortConfig} deleteFn={fn} />
            </div>
            <TablePagination setPage={setPage} totalPage={totalPage} />
        </div>
    )
}

export default TransactionDetails
