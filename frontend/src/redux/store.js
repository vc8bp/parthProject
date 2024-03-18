import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import cartReducer from './slice/cartSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        cart: cartReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})