import bcrypt from 'bcrypt'
import prisma from '../../libs/prismaDb'
import { NextResponse } from 'next/server';
export async function PUT(req: Request) {
    const body = await req.json();

    if (!body?.email)
        throw new Error("Invalid Request")

    const password = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.update({
        where: { email: body.email },
        data: { password }
    })
    return NextResponse.json({ user })
}