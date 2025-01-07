'use server'
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const getAuthenticatedUser = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("UnAuthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return user;
};