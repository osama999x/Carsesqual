"use client";

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3004";

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state: any = getState();
        const token: string | undefined = state?.auth?.accessToken;
        console.log("Base API - preparing headers, token:", token ? `present (${token.substring(0, 20)}...)` : "not present");
        console.log("Base API - full auth state:", state?.auth);
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
            console.log("Base API - Authorization header set with Bearer token");
        } else {
            console.log("Base API - No token available, skipping authorization header");
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
    credentials: "omit", // Changed from "include" to avoid CORS issues
});

export const baseQuery = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQueryWithAuth(args, api, extraOptions);

    // Log 401 errors but don't auto-clear tokens to prevent logout loops
    if (result.error && result.error.status === 401) {
        console.log("401 Unauthorized error detected:", result.error);
        console.log("Token may be expired or invalid, but not auto-clearing to prevent logout loops");
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Category", "Car", "Auth"],
    endpoints: () => ({}),
});

export type EmptyObj = Record<string, never>;


