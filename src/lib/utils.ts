import { TAsycncAccount, TTransaction } from "@/types/global-types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function capitaliize(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()

}
export const seralizedTransaction = (obj: TTransaction) => {


  if ('amount' in obj && typeof obj.amount !== "number") {
    return {
      ...obj,
      amount: obj.amount?.toNumber()
    };
  }
  return obj;
}
export const seralizedAccount = (obj: TAsycncAccount) => {

  if ('balance' in obj && typeof obj.balance !== "number") {
    return {
      ...obj,
      balance: obj.balance.toNumber()
    };
  }

  return obj;
}
