"use client";

import { api } from "./baseApi";

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    cars?: any[]; // Array of cars in this category
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export const categoriesApi = api.injectEndpoints({
    endpoints: (build) => ({
        createCategory: build.mutation<Category, { name: string; description: string }>({
            query: (body) => {
                console.log("API createCategory body:", body);
                return { url: "/categories", method: "POST", body };
            },
            invalidatesTags: ["Category"],
        }),
        getCategories: build.query<{ data: Category[]; total?: number }, PaginationQuery | void>({
            query: (params) => {
                console.log("API getCategories params:", params);
                const searchParams = params || {};
                return { url: "/categories", params: searchParams };
            },
            providesTags: ["Category"],
        }),
        getCategory: build.query<Category, string>({
            query: (id) => ({ url: `/categories/${id}` }),
            providesTags: ["Category"],
        }),
        updateCategory: build.mutation<Category, { id: string; body: { name: string; description: string } }>({
            query: ({ id, body }) => {
                console.log("API updateCategory id:", id, "body:", body);
                return { url: `/categories/${id}`, method: "PUT", body };
            },
            invalidatesTags: ["Category"],
        }),
        deleteCategory: build.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;


