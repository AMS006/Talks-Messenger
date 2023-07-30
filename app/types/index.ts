import { Conversation, Message, User } from "@prisma/client"

export type MessageType = (Message & {
    sender: User
})
export type ConversationType = (Conversation & {
    users: User[]
    messages: MessageType[]
})
