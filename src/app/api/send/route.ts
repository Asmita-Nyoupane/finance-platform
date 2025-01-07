
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PostParams {
    to: string;
    subject: string;
    react: any;
}

export async function POST({ to, subject, react }: PostParams) {
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
    } catch (error) {
        throw new Error("Server Error");
    }
}
