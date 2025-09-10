"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadTokensFromStorage } from "../store/authSlice";
import DashboardLayout from "./DashboardLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete and load auth from localStorage
  useEffect(() => {
    setIsHydrated(true);
    dispatch(loadTokensFromStorage());
  }, [dispatch]);

  const isAuthenticated = !!accessToken;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname === "/categories" || pathname === "/cars";

  console.log("AuthLayout Debug:", {
    accessToken: accessToken ? "present" : "not present",
    pathname,
    isAuthenticated,
    isAuthPage,
    isProtectedPage,
    isHydrated,
  });

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    console.log("AuthLayout useEffect:", {
      isAuthenticated,
      isProtectedPage,
      isAuthPage,
      pathname,
      isHydrated,
    });

    if (!isAuthenticated && isProtectedPage) {
      console.log("Redirecting to login - not authenticated on protected page");
      router.push("/login");
    } else if (isAuthenticated && isAuthPage) {
      console.log("Redirecting to cars - authenticated on auth page");
      router.push("/cars");
    } else if (!isAuthenticated && pathname === "/") {
      console.log("Redirecting to login - not authenticated on home");
      router.push("/login");
    }
  }, [
    isAuthenticated,
    pathname,
    router,
    isAuthPage,
    isProtectedPage,
    isHydrated,
  ]);

  // If user is authenticated and on a protected page after hydration, show dashboard layout
  if (isHydrated && isAuthenticated && isProtectedPage) {
    console.log("Rendering DashboardLayout");
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Default layout for auth pages and during hydration
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for auth pages */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Car Management
              </h1>
            </div>

            <nav className="flex items-center space-x-6">
              <a
                href="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/login"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Login
              </a>
              <a
                href="/register"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/register"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Register
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {!isHydrated ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
