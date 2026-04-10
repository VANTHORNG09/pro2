"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { AddUserForm } from "./form";
import { type AddUserFormData } from "./schema";

export default function AddUserPage() {
  const handleSubmit = async (data: AddUserFormData) => {
    await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      </div>

      {/* Form */}
      <AddUserForm onSubmit={handleSubmit} />
    </div>
  );
}
