import { RecurringInterval, TransactionType } from "@prisma/client";
import { z } from "zod";

export const TransactionSchema = z.object({

    type: z.nativeEnum(TransactionType),
    amount: z.string().transform((val) => Number(val)),
    accountId: z.string(),
    description: z.string().nullable().optional(),
    date: z.date(),
    category: z.string(),
    receiptUrl: z.string().url().nullable().optional(),
    isRecurring: z.boolean(),
    recurringInterval: z.nativeEnum(RecurringInterval).nullable().optional(),
    nextRecurringDate: z.date().nullable().optional(),
    lastProcessed: z.date().nullable().optional(),

});

// Infer the type from the schema 
export type TTransactionSchema = z.infer<typeof TransactionSchema>;
