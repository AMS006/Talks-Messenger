import getUserDetails from '@/app/actions/getUserDetail'
import prisma from '../../libs/prismaDb'
import { NextResponse } from 'next/server'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const currUser = await getUserDetails()

        const message = await prisma.message.create({
            data: {
                text: body?.text,
                image: body?.image,
                conversation: {
                    connect: { id: body.conversationId }
                },
                messageType: body?.messageType,
                sender: {
                    connect: { id: currUser?.id }
                }
            },
            include: {
                sender: true
            }
        })
        const updatedConversation = await prisma.conversation.update({
            where: { id: body.conversationId },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: { id: message.id }
                }
            },
            include: {
                users: true,
                messages: true
            }
        })
        await pusherServer.trigger(body.conversationId, 'message:new', message)

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email, 'conversation:update', {
                id: body.conversationId,
                lastMessageAt: updatedConversation.lastMessageAt,
                messages: [lastMessage]
            })
        })

        return NextResponse.json({ message })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}