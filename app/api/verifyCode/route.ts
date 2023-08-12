import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const user = await prisma.user.findUnique({
            where: { email: body.email }
        })
        if (!user)
            throw new Error("Invalid Request")

        if (user.resetCode === body.code){
            await prisma.user.update({where:{email:body.email}, data:{resetCode:""}})
            return NextResponse.json({ message: "Correct Code" })
        }

        throw new Error("Incorrect Code")
    } catch (error) {
        throw new Error("Something went wrong in server")
    }
}