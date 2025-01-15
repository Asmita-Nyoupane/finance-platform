
'use client'
import { TAccount } from "@/types/global-types";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { capitaliize } from "@/lib/utils";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TProps = {
    id: string
}
import { upateAccount } from "@/actions/account.action";
const MyAccount = ({ account }: { account: TAccount & TProps }) => {
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
export default MyAccount