import { NextResponse } from 'next/server';
import prisma from '../../libs/prismaDb'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        if (!body)
            throw new Error("Invalid Request");
        const user = await prisma.user.findUnique({
            where: { email: body.email }
        })
        if (!user)
            throw new Error("No User Found")

        return NextResponse.json({ user });
    } catch (error) {
        throw new Error("Invalid Request");
    }
}