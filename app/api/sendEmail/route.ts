import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const user = await prisma?.user.findUnique({
            where: { email: body.email }
        })
        if (!user)
            throw new Error("Incorrect Code")

        if (user.resetCode === body.code)
            return NextResponse.json({ message: "Correct Password" })

        throw new Error("Incorrect Code")
    } catch (error) {
        throw new Error("Something went wrong")
    }
}