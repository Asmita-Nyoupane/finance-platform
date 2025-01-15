
"use server"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PostParams {
    to: string;
    subject: string;
    // eslint-disable-next-line
    react: any;
}

export async function SendEmail({ to, subject, react }: PostParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'money-trail<onboarding@resend.dev>',
            to,
            subject,
            react
        });

        if (error) {
            throw new Error(error.message);
        }

        return Response.json(data);
        //  @typescript-eslint/no-explicit-any
    } catch (error) {
        console.log("🚀 ~ POST ~ error:", error)
        throw new Error("Server Error");
    }
}
