"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { EditUserForm } from "./form";
import { type EditUserFormData } from "./schema";
import { type UserRole } from "@/features/auth/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive";
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest<UserData>(`/users/${userId}`);
        setUser(data);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (data: EditUserFormData) => {
    setIsSubmitting(true);
    await apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold">User Not Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-4" onClick={() => router.push("/admin/users")}>
              Go to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <EditUserForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
