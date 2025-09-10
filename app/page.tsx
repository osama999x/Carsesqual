"use client";

import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/cars");
    } else {
      router.push("/login");
    }
  }, [accessToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
