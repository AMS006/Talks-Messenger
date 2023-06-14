import { MessageType } from "@/app/types"
import { PayloadAction, createSlice, current } from "@reduxjs/toolkit"

interface IType {
    conversationId: string,
    messages: MessageType[]
}
interface message {
    allMessages: IType[]
    currMessages: MessageType[] | undefined
}
const initialState: message = {
    allMessages: [],
    currMessages: undefined
}
const updatehandler = (state: message, id: string, message: MessageType) => {
    const messages = state.allMessages.find((message) => message.conversationId === id)
    let updatedMessage: MessageType[] = []
    if (messages) {
        updatedMessage = [message, ...messages.messages]
    }
    return updatedMessage
}
const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addNewMessage: (state, action: PayloadAction<IType>) => {
            state.allMessages.push(action.payload)
        },
        updateMessage: (state, action: PayloadAction<{ id: string, message: MessageType }>) => {
            const updatedMessage = updatehandler(current(state), action.payload.id, action.payload.message)
            state.allMessages = state.allMessages.map((message) => {
                if (message.conversationId === action.payload.id) {
                    return { conversationId: action.payload.id, messages: updatedMessage }
                }
                return message
            })
        },
        setCurrMessages: (state, action: PayloadAction<MessageType[]>) => {
            state.currMessages = action.payload
        }
    }
})
export const { addNewMessage, setCurrMessages, updateMessage } = messageSlice.actions

export default messageSlice.reducer

