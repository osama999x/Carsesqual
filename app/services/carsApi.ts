"use client";

import { api } from "./baseApi";

export interface Car {
    id: string;
    name: string;
    year: number;
    price: string | number; // Can be string or number
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
        description?: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export const carsApi = api.injectEndpoints({
    endpoints: (build) => ({
        createCar: build.mutation<Car, {
            name: string;
            year?: number;
            price?: number;
            categoryId: string;
        }>({
            query: (body) => ({ url: "/cars", method: "POST", body }),
            invalidatesTags: ["Car"],
        }),
        getCars: build.query<{ data: Car[]; total?: number }, PaginationQuery | void>({
            query: (params) => {
                const searchParams = params || {};
                return { url: "/cars", params: searchParams };
            },
            providesTags: ["Car"],
        }),
        getCar: build.query<Car, string>({
            query: (id) => ({ url: `/cars/${id}` }),
            providesTags: ["Car"],
        }),
        updateCar: build.mutation<Car, {
            id: string;
            body: {
                name: string;
                year?: number;
                price?: number;
                categoryId: string;
            }
        }>({
            query: ({ id, body }) => ({ url: `/cars/${id}`, method: "PUT", body }),
            invalidatesTags: ["Car"],
        }),
        deleteCar: build.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/cars/${id}`, method: "DELETE" }),
            invalidatesTags: ["Car"],
        }),
    }),
});

export const {
    useCreateCarMutation,
    useGetCarsQuery,
    useGetCarQuery,
    useUpdateCarMutation,
    useDeleteCarMutation,
} = carsApi;


