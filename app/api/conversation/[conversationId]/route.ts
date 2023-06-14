import { NextResponse } from 'next/server'
import prisma from '../../../libs/prismaDb'
import { pusherServer } from '@/app/libs/pusher'
interface Iparams {
    conversationId: string
}
export async function DELETE(req: Request, { params }: { params: Iparams }) {
    try {
        const conversation = await prisma.conversation.delete({
            where: { id: params.conversationId },
            include: {
                users: true
            }
        })
        const messages = await prisma.message.deleteMany({
            where: { conversationId: params.conversationId }
        })
        conversation.users.map((user) => {
            pusherServer.trigger(user.email, 'conversation:delete', conversation)
        })
        return NextResponse.json({ message: "Conversation deleted" })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}