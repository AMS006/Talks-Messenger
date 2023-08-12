import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'

export async function PUT(req: Request) {
    try {
        const body = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: body.email }
        })
        if (!user)
            throw new Error("No User Found")
        // if(!user?.image){

        // }
        const user1 = await prisma.user.update({
            where: { email: body.email },
            data: { name: body.name, image: body.image }
        })
        return NextResponse.json({ message: "User Updated" })
    } catch (error) {
        throw new Error("User Update Fail")
    }
}