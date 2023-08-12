import { NextResponse } from 'next/server'

import prisma from '@/libs/prismaDb'
import getUserDetails from '@/actions/getUserDetail'
import { pusherServer } from '@/libs/pusher'

export async function POST(req: Request) {
    try {
        const currentUser = await getUserDetails()
        const body = await req.json()

        // Group leave request
        if (body?.leaveGroup) {
            const conversation = await prisma.conversation.update({
                where: { id: body.conversationId },
                data: {
                    userIds: [
                        ...body.members.map((member: { value: string }) => (
                            member.value
                        )),
                    ],
                },
                include: {
                    users: true
                }
            })
            conversation.users.map((user) => {
                pusherServer.trigger(user.email, 'conversation:group:update', conversation)
            })
            if (currentUser)
                pusherServer.trigger(currentUser?.email, 'conversation:group:leave', conversation)
            return NextResponse.json({ conversation })
        }

        // Adding Members in Group 
        if (body.conversationId) {
            const currConversationDetail = await prisma.conversation.findUnique({
                where: { id: body.conversationId },
                include: {
                    users: true
                }
            })
            if (currConversationDetail) {
                if (body.members && body.members.length > 0) {
                    const conversation = await prisma.conversation.update({
                        where: { id: body.conversationId },
                        data: {
                            name: body.name,
                            userIds: [
                                ...body.members.map((member: { value: string }) => (
                                    member.value
                                )),
                                ...currConversationDetail.userIds.map((id) => id),
                            ],
                            users: {
                                connect: [
                                    ...body.members.map((member: { value: string }) => (
                                        { id: member.value }
                                    )),
                                    ...currConversationDetail.userIds.map((id) => (
                                        { id }
                                    ))
                                ]
                            }
                        },
                        include: {
                            users: true,
                            messages: {
                                orderBy: {
                                    createdAt: "desc"
                                }
                            }
                        },
                    })
                    conversation.users.map((user) => {
                        if (user.email)
                            pusherServer.trigger(user.email, 'conversation:group:update', conversation)
                    })
                    return NextResponse.json({ conversation })
                } else {
                    const conversation = await prisma.conversation.update({
                        where: { id: body.conversationId },
                        data: {
                            name: body.name,
                        },
                        include: {
                            users: true,
                            messages: {
                                orderBy: {
                                    createdAt: "desc"
                                }
                            }
                        },
                    })
                    conversation.users.map((user) => {
                        if (user.email)
                            pusherServer.trigger(user.email, 'conversation:group:update', conversation)
                    })
                    return NextResponse.json({ conversation })
                }

            }
        }

        // New Group Creation Error If members are less than 2
        if (body.isGroup && (!body.members || body.members.length < 2)) {
            return NextResponse.json({ message: "Invalid Request" })
        }

        // Create new Group Conversation
        if (body.isGroup) {
            const conversation = await prisma.conversation.create({
                data: {
                    name: body.name,
                    isGroup: true,
                    users: {
                        connect: [
                            ...body.members.map((member: { value: string }) => (
                                { id: member.value }
                            )),
                            {
                                id: currentUser?.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })
            conversation.users.map((user) => {
                if (user.email)
                    pusherServer.trigger(user.email, 'conversation:new', conversation)
            })
            return NextResponse.json({ conversation })
        }

        // Create a new conversation between two users
        const conversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: currentUser?.id },
                        { id: body.id }
                    ]
                }
            },
            include: {
                users: true
            }
        })
        conversation.users.map((user) => {
            if (user.email)
                pusherServer.trigger(user.email, 'conversation:new', conversation)
        })
        return NextResponse.json({ conversation })

    } catch (error) {
        throw new Error("Invalid Request")
    }
}

// Get all Conversation of user
export async function GET() {
    try {
        const currentUser = await getUserDetails()
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currentUser?.id
                }
            },
            include: {
                users: true,
                messages: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        sender: true
                    }
                }
            }
        })
        return NextResponse.json({ conversations })
    } catch (error) {
        throw new Error("Invalid Request")
    }
}
