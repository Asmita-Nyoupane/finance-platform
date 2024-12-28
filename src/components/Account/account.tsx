"use client";
import React from "react";
import CreateAccountForm from "@/components/Account/create-account-form";
import CustomModal from "@/components/Global/custom-modal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TAsycncAccount } from "@/types/global-types";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { capitaliize } from "@/lib/utils";
import { useFetch } from "@/hooks/use-fetch";
import { upateAccount } from "@/actions/dasboard.action";
import { toast } from "sonner";


const Account = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => {
        setIsOpen(false);
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    return (
        <CustomModal
            trigger={

                <Card className="flex-center flex-col gap-4 w-fit py-6 px-10 shadow-md hover:bg-primary-foreground cursor-pointer hover:shadow-xl  hover:scale-y-105 transition-all duration-300 min-w-[260px] min-h-[150px]" onClick={onOpen}>
                    <Plus size={40} className="font-extrabold" />
                    <span className="text-xl font-semibold text-muted-foreground">
                        Create Account
                    </span>
                </Card>
            }
            isOpen={isOpen}
            onClose={onClose}
            title="Create Account"
        >


            <CreateAccountForm onClose={onClose} />
        </CustomModal>
    );
};





const MyAccount = ({ account }: { account: Omit<TAsycncAccount, "balance"> & { balance: number } }) => {
    const { id, name, balance, type, isDefault } = account
    const { data, loading, error, fn } = useFetch(upateAccount)
    const handleDefaultChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        await fn(id)
        if (error && !!data && !loading) {
            toast.error(error);
        } else {
            toast.success("Default account updated successfully")
        }
    }
    return (
        <Link href={`account/${id}`}>
            <Card className="hover:shadow-xl  hover:scale-y-105 transition-all duration-300  hover:bg-primary-foreground min-w-[260px] min-h-[150px] ease-in-out">
                <CardHeader className="flex  flex-row justify-between  gap-5 items-center">
                    <CardTitle className="subtitle text-wrap ">{capitaliize(name)}</CardTitle>
                    <Switch checked={isDefault} color={isDefault ? "bg-brand" : ""} disabled={loading} onClick={handleDefaultChange} />

                </CardHeader>
                <CardContent className="flex justify-start  flex-col gap-1 items-start font-semibold">
                    <p className="flex-center gap-1"> <span>Total Balance :</span> <span className="font-bold text-lg">
                        $ {balance}</span> </p>
                    <p className="text-sm md:text-md text-muted-foreground">{capitaliize(type)} Account</p>
                </CardContent>
            </Card>

        </Link>
    )
}


export { MyAccount, Account }