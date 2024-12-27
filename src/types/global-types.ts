import { AccountType } from "@prisma/client"

export type TAccount = {
    name: string
    type: AccountType
    balance: number
    isDefault: boolean
}