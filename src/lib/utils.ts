import { TAsycncAccount, TAsyncTransaction, TModiifiedAccount, TTransaction } from "@/types/global-types"
import { Decimal } from "@prisma/client/runtime/library"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function capitaliize(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()

}

export const seralizedTransaction = (obj: TAsyncTransaction): TTransaction => {

  return {
    ...obj,
    amount: obj.amount.toNumber(),
  };


}
export const seralizedAccount = (obj: TModiifiedAccount): TAsycncAccount => {

  if ('balance' in obj && typeof obj.balance !== "number") {
    return {
      ...obj,
      balance: Number(obj.balance)
    };
  }

  return obj;
}
