import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { checkBudgetalert, processedRecuringTransaction, triggerRecuringTransaction } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        checkBudgetalert,
        triggerRecuringTransaction,
        processedRecuringTransaction

    ],
});

