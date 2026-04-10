"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { editUserSchema, type EditUserFormData } from "./schema";
import { type UserRole } from "@/features/auth/types";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive";
}

interface EditUserFormProps {
  user: UserData;
  onSubmit: (data: EditUserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EditUserForm({ user, onSubmit, isLoading }: EditUserFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  const selectedRole = watch("role");

  const handleFormSubmit = async (data: EditUserFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
      router.push("/admin/users");
    } catch (error: any) {
      setServerError(error.message || "Failed to update user. Please try again.");
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const roleColors: Record<UserRole, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    teacher: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    student: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  };

  const roleLabels: Record<UserRole, string> = {
    admin: "Admin",
    teacher: "Teacher",
    student: "Student",
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* User Info Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={roleColors[user.role]}>
                  {roleLabels[user.role]}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                      : "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400"
                  }
                >
                  {user.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit User Details</CardTitle>
          <CardDescription>
            Update the user's name, email, and assigned role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert className="mb-6 bg-red-500/10 border-red-500 text-red-500">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Name */}
            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Separator />

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Assigned Role
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {(["admin", "teacher", "student"] as const).map((role) => {
                  const RoleIcon = Shield;
                  return (
                    <label
                      key={role}
                      className={`relative flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                        selectedRole === role
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value={role}
                        className="sr-only"
                        {...register("role")}
                      />
                      <RoleIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {roleLabels[role]}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
