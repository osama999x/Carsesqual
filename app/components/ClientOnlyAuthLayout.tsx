"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadTokensFromStorage } from "../store/authSlice";
import DashboardLayout from "./DashboardLayout";
import ClientWrapper from "./ClientWrapper";

interface ClientOnlyAuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayoutContent({ children }: ClientOnlyAuthLayoutProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Load auth from localStorage on mount
  useEffect(() => {
    dispatch(loadTokensFromStorage());
  }, [dispatch]);

  const isAuthenticated = !!accessToken;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname === "/categories" || pathname === "/cars";

  console.log("AuthLayoutContent Debug:", {
    accessToken: accessToken ? "present" : "not present",
    pathname,
    isAuthenticated,
    isAuthPage,
    isProtectedPage,
  });

  useEffect(() => {
    console.log("AuthLayoutContent useEffect:", {
      isAuthenticated,
      isProtectedPage,
      isAuthPage,
      pathname,
    });

    // Add a small delay to allow localStorage to load
    const timeoutId = setTimeout(() => {
      if (!isAuthenticated && isProtectedPage) {
        console.log(
          "Redirecting to login - not authenticated on protected page"
        );
        router.push("/login");
      } else if (isAuthenticated && isAuthPage) {
        console.log("Redirecting to cars - authenticated on auth page");
        router.push("/cars");
      } else if (!isAuthenticated && pathname === "/") {
        console.log("Redirecting to login - not authenticated on home");
        router.push("/login");
      }
    }, 100); // 100ms delay to allow auth loading

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, pathname, router, isAuthPage, isProtectedPage]);

  // If user is authenticated and on a protected page, show dashboard layout
  if (isAuthenticated && isProtectedPage) {
    // console.log("Rendering DashboardLayout for protected page:", pathname);
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // For auth pages (login/register), show simple layout
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
      <main>{children}</main>
    </div>
  );
}

export default function ClientOnlyAuthLayout({
  children,
}: ClientOnlyAuthLayoutProps) {
  return (
    <ClientWrapper
      fallback={
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Car Management
                  </h1>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      }
    >
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </ClientWrapper>
  );
}
