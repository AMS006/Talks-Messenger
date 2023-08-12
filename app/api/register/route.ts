import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'

export async function POST(request: Request) {
    const data = await request.json()

    const isUserPresent = await prisma.user.findUnique(
        {
            where: { email: data.email }
        }
    )
    if (isUserPresent)
        throw new Error("User Already Present")

    const { name, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: { name, email, password: hashPassword }
    })

    return NextResponse.json({message:"User Registration Successfull"});
}