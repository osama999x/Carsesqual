"use client";

import {
  useCreateCarMutation,
  useDeleteCarMutation,
  useGetCarsQuery,
  useUpdateCarMutation,
  Car,
} from "../services/carsApi";
import { useGetCategoriesQuery } from "../services/categoriesApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import CarModal from "../components/CarModal";

export default function CarsPage() {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // Only make API calls if we have a token
  const {
    data: carsData,
    isLoading,
    refetch,
  } = useGetCarsQuery(
    {},
    {
      skip: !accessToken,
    }
  );
  const { data: categoriesData } = useGetCategoriesQuery(
    {},
    {
      skip: !accessToken,
    }
  );
  const [createCar, { isLoading: isCreating }] = useCreateCarMutation();
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Auth check removed - handled by AuthLayout

  const handleModalSubmit = async (carData: {
    name: string;
    year: number;
    price: number | string;
    categoryId: string;
  }) => {
    try {
      console.log("Submitting car data:", carData);

      if (editingCar) {
        console.log("Updating car with ID:", editingCar.id);
        const result = await updateCar({
          id: editingCar.id,
          body: carData as any,
        }).unwrap();
        console.log("Update successful:", result);
      } else {
        console.log("Creating new car");
        const result = await createCar(carData as any).unwrap();
        console.log("Create successful:", result);
      }

      setIsModalOpen(false);
      setEditingCar(null);
      refetch();
    } catch (error) {
      console.error("Car operation failed:", error);
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

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCar(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const getCategoryName = (car: Car) => {
    // Use nested category if available, otherwise fall back to categoriesData
    if (car.category) {
      return car.category.name;
    }
    const category = categoriesData?.data?.find((c) => c.id === car.categoryId);
    return category?.name || car.categoryId;
  };

  // Auth check removed - handled by AuthLayout

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cars Management
        </h1>
        <p className="text-gray-600 mb-6">Manage your car inventory</p>
      </div>

      {/* All Cars Section - Center */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Cars</h2>
            <button
              onClick={handleAddNew}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add New Car
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
          ) : carsData?.data?.length === 0 ? (
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
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-4">No cars found</p>
              <p className="text-gray-400">
                Click &quot;Add New Car&quot; to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(carsData?.data ?? []).map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {car.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{car.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${car.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryName(car)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
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

      {/* Car Modal */}
      <CarModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
        editingCar={editingCar}
      />
    </div>
  );
}
