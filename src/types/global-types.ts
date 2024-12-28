import { AccountType } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type TAccount = {
    name: string
    type: AccountType
    balance: number
    isDefault: boolean
}
export type TAsycncAccount = {
    name: string;
    type: AccountType;
    isDefault: boolean;
    balance: Decimal,
    userId: string;
    id: string;
}