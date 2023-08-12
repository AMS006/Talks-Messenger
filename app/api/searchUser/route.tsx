import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'
import getSession from '@/actions/getSession'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const session = await getSession()
        if (!session?.user?.email)
            throw new Error("Invalid Request")
        if (!body)
            return []
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: body.searchData } },
                    { email: { contains: body.searchData } }
                ],
                NOT: { email: session?.user?.email }
            }
        })
        return NextResponse.json({ users })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}