import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from './conversation/slice'
import userReducer from './user/slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
   
  devTools: true
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch