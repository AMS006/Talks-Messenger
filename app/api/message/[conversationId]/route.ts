import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'
import { pusherServer } from '@/libs/pusher'

interface Iparams {
    conversationId?: string
}

export async function DELETE(req: Request, { params }: { params: Iparams }) {
    try {
        const { conversationId } = params
        await prisma.message.deleteMany({
            where: { conversationId }
        })
        if (conversationId)
            await pusherServer.trigger(conversationId, 'message:delete', {})
        return NextResponse.json({ message: "Message Deleted" })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}
export async function GET(req: Request, { params }: { params: Iparams }) {
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId: params.conversationId },
            include: {
                sender: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return NextResponse.json({ messages })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}