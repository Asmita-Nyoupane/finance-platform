import { TAsycncAccount, TAsyncTransaction, TModiifiedAccount, TTransaction } from "@/types/global-types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function capitaliize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()

}

export const seralizedTransaction = (obj: TAsyncTransaction): TTransaction => {

  return {
    ...obj,
    amount: obj.amount.toNumber(),
  };


}
export const seralizedAccount = (obj: TModiifiedAccount): TAsycncAccount => {

  return {
    ...obj,
    balance: obj.balance.toNumber()
  };
}




export function calculateNextRecurringDate(startDate: Date, interval: string) {
  const date = new Date(startDate)
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1)
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7)
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1)
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1)
      break;
    default:
      break;
  }
  return date
}