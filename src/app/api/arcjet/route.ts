import arcjet, { tokenBucket } from "@arcjet/next";


export const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["userId"], //track based on clerk user id
    rules: [

        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE",
            refillRate: 10, // Refill 5 tokens per interval
            interval: 3600, // Refill every 2 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});



