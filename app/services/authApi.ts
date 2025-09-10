"use client";

import { api } from "./baseApi";

export interface LoginRequest {
    phone?: string;
    email?: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    email?: string;
    phoneNumber: string;
    password: string;
}

export interface AuthResponse {
    statusCode: number;
    apiVersion: string;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({ url: "/auth/login", method: "POST", body }),
            invalidatesTags: ["Auth"],
        }),
        register: build.mutation<unknown, RegisterRequest>({
            query: (body) => ({ url: "/auth/register", method: "POST", body }),
        }),
        refreshToken: build.mutation<AuthResponse, { refreshToken: string }>({
            query: (body) => ({ url: "/auth/refresh-token", method: "POST", body }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi;


