import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth-slice";

export const store = configureStore({
    reducer: authSlice.reducer
});