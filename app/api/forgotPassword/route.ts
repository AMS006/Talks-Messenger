import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

import prisma from '../../libs/prismaDb'
import sendEmail from '@/app/actions/sendEmail'

export async function POST(request: Request, responce: NextResponse) {

    const body = await request.json()
    const user = await prisma.user.findUnique({
        where: { email: body.email }
    })

    if (!user)
        throw new Error("User Not Found")

    const isAccount = await prisma.account.findMany({
        where: { userId: user?.id }
    })
    if (isAccount.length > 0)
        throw new Error("User Not Found")

    const code = String(Math.floor(100000 + Math.random() * 900000))

    const userData = await prisma.user.update({
        where: { email: body.email },
        data: { resetCode: code }
    })
    const data = {
        name: userData.name || '',
        email: userData.email || '',
        code: userData.resetCode || ''
    }
    sendEmail(data)
    return NextResponse.json({ message: "Email Send To User" })
}