"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear auth token and user data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Redirect to login
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">Logging out...</p>
      </div>
    </div>
  );
}
