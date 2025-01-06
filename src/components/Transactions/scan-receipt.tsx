"use client"
import { scanReceipt } from '@/actions/transaction.action'
import { useFetch } from '@/hooks/use-fetch'
import { CameraIcon, Loader } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'sonner'
import { TScanData } from './create-transaction-form'
import { Button } from '../ui/button'
type TProps = {
    onScanComplete: (scandata: TScanData) => void
}

const ScanReceipt = ({ onScanComplete }: TProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { loading, fn, data, error } = useFetch(scanReceipt)
    const handleReceiptScan = async (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than  5 MB")
            return;
        }
        try {
            await fn(file)
            if (data && !loading) {

                onScanComplete(data)
                toast.success("Receipt scanned successfully")
            } else {
                toast.error(error)
            }

        } catch (error: any) {
            toast.error(error)
            console.log("🚀 ~ handleReceiptScan ~ error:", error)

        }

    }
    return (
        <>
            <input type="file" ref={fileInputRef} className='hidden' accept='image/*' capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0]

                    if (file) handleReceiptScan(file)
                }}
            /><Button disabled={loading}
                className="w-full h-10 relative overflow-hidden text-white group border border-transparent hover:border-pink-500"
                onClick={() => fileInputRef.current?.click()}
            >
                <span className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-purple-800 animate-gradient border border-transparent group-hover:opacity-50" />
                <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                        <>
                            <Loader className="mr-2 animate-spin size-4" />
                            Scanning
                        </>
                    ) : (
                        <>
                            <CameraIcon className="mr-2 size-4" />
                            Scan Receipt with AI
                        </>
                    )}
                </span>
                <div className="absolute inset-0 rounded-md pointer-events-none border-2 border-transparent group-hover:border-pink-500 transition-all animate-border" />
            </Button>
        </>
    )

}

export default ScanReceipt
