import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return <SignUp appearance={{
        elements: {
            formButtonPrimary: 'bg-brand hover:bg-brand-foreground text-md border-none rounded-md p-2 text-white outline-none focus:ring-0',
        },
    }} />
}