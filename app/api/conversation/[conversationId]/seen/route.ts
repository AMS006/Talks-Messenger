import getUserDetails from "@/app/actions/getUserDetail"
import { pusherServer } from "@/app/libs/pusher"
import { NextResponse } from "next/server"

interface Iparams {
    conversationId: string
}
export async function POST(req: Request, { params }: { params: Iparams }) {
    try {
        const { conversationId } = params

        const currUser = await getUserDetails()

        if (!currUser?.id) {
            return new NextResponse('Unauthorized')
        }
        const conversation = await prisma?.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seenUsers: true
                    }
                },
                users: true
            },
        })
        if (!conversation) {
            return new NextResponse('Invalid Conversation Id', { status: 400 })
        }
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) {
            return NextResponse.json(conversation)
        }

        const updatedMessage = await prisma?.message.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seenUsers: {
                    connect: {
                        id: currUser.id
                    }
                }
            }
        });
        await pusherServer.trigger(currUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })
        if (lastMessage.seenUserIds.indexOf(currUser.id) !== -1) {
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId, 'message:update', updatedMessage);

        return new NextResponse("Updated")

    } catch (error) {
        throw new Error("Invalid Request")
    }
}