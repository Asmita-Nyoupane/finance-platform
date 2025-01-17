
"use server"
import { Resend } from 'resend';



interface PostParams {
    to: string;
    subject: string;
    react: React.ReactNode

}



export async function SendEmail({ to, subject, react }: PostParams) {
    console.log({ to, subject, react });

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { data } = await resend.emails.send({
            from: 'MoneyTrail <onboarding@resend.dev>',
            to,
            subject,
            react
        });


        console.log("Email sent successfully:", data);
        return { success: true, data };
        //  @typescript-eslint/no-explicit-any
    } catch (error) {
        console.log("🚀 ~ POST ~ error:", error)
        return { success: false, error: (error as Error)?.message || error };
    }
}
