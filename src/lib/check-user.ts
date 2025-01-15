import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {

    const user = await currentUser();
    if (!user) return null;
    try {

        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if (loggedInUser) return loggedInUser;
        else {
            const newUser = await db.user.create({
                data: {
                    clerkUserId: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    imageUrl: user.imageUrl,
                    email: user.emailAddresses[0].emailAddress,
                }
            })
            return newUser;
        }

        // eslint-disable-next-line
    } catch (error: any) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}