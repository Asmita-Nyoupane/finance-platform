import { AccountType } from "@prisma/client";
import { z } from "zod";


export const AccountSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    type: z.nativeEnum(AccountType),
    balance: z.string().min(1, "Balance is required").transform((val) => parseFloat(val)),
    isDefault: z.boolean(),
});

// Infer the type from the schema (optional)
export type TAccountSchema = z.infer<typeof AccountSchema>;
