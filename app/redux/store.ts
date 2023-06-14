import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from './conversation/slice'
import userReducer from './user/slice'
import messageReducer from './message/slice'

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    user: userReducer,
    message: messageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch