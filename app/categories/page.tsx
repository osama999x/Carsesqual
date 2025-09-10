"use client";

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  Category,
} from "../services/categoriesApi";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { loadTokensFromStorage } from "../store/authSlice";
import CategoryModal from "../components/CategoryModal";

export default function CategoriesPage() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Only make API call if we have a token
  const { data, isLoading, refetch, error } = useGetCategoriesQuery(
    {},
    {
      skip: !accessToken, // Skip the query if no access token
    }
  );

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Auth check removed - handled by AuthLayout

  const handleModalSubmit = async (categoryData: {
    name: string;
    description: string;
  }) => {
    try {
      console.log("Submitting category data:", categoryData);

      if (editingCategory) {
        console.log("Updating category with ID:", editingCategory.id);
        const result = await updateCategory({
          id: editingCategory.id,
          body: categoryData,
        }).unwrap();
        console.log("Update successful:", result);
      } else {
        console.log("Creating new category");
        const result = await createCategory(categoryData).unwrap();
        console.log("Create successful:", result);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      refetch();
    } catch (error) {
      console.error("Category operation failed:", error);
      console.error("Error details:", {
        status: (error as any)?.status,
        data: (error as any)?.data,
        message: (error as any)?.message,
      });

      // Don't close modal on error so user can see what went wrong
      alert(
        `Operation failed: ${
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Unknown error"
        }`
      );
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Auth check removed - handled by AuthLayout

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Categories Management
        </h1>
        <p className="text-gray-600 mb-6">Manage your car categories</p>
      </div>

      {/* All Categories Section - Center */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Categories
            </h2>
            <button
              onClick={handleAddNew}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add New Category
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-4">No categories found</p>
              <p className="text-gray-400">
                Click &quot;Add New Category&quot; to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cars Count
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(data?.data ?? []).map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {category.cars?.length || 0} cars
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
        editingCategory={editingCategory}
      />
    </div>
  );
}
