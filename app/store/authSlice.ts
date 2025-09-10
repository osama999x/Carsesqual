"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    accessToken?: string;
    refreshToken?: string;
}

const initialState: AuthState = {};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTokens: (
            state,
            action: PayloadAction<{ accessToken?: string; refreshToken?: string }>
        ) => {
            console.log("Setting tokens in Redux:", action.payload);
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('auth', JSON.stringify(state));
                    console.log("Auth state saved to localStorage");
                } catch (error) {
                    console.error("Failed to save auth to localStorage:", error);
                }
            }
        },
        loadTokensFromStorage: (state) => {
            if (typeof window !== 'undefined') {
                try {
                    const storedAuth = localStorage.getItem('auth');
                    console.log("Raw localStorage auth:", storedAuth);
                    if (storedAuth) {
                        const parsed = JSON.parse(storedAuth);
                        console.log("Parsed auth from localStorage:", parsed);
                        state.accessToken = parsed.accessToken;
                        state.refreshToken = parsed.refreshToken;
                        console.log("Auth state after loading:", { accessToken: state.accessToken ? "present" : "not present" });
                    } else {
                        console.log("No auth found in localStorage");
                    }
                } catch (error) {
                    console.error("Failed to load auth from localStorage:", error);
                }
            }
        },
        clearTokens: (state) => {
            state.accessToken = undefined;
            state.refreshToken = undefined;

            // Clear from localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('auth');
                    console.log("Auth state cleared from localStorage");
                } catch (error) {
                    console.error("Failed to clear auth from localStorage:", error);
                }
            }
        },
    },
});

export const { setTokens, loadTokensFromStorage, clearTokens } = authSlice.actions;
export default authSlice.reducer;


