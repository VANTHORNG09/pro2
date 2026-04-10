"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addUserSchema, type AddUserFormData } from "./schema";

interface AddUserFormProps {
  onSubmit: (data: AddUserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AddUserForm({ onSubmit, isLoading }: AddUserFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const selectedRole = watch("role");

  const handleFormSubmit = async (data: AddUserFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
      router.push("/admin/users");
    } catch (error: any) {
      setServerError(error.message || "Failed to create user. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New User</CardTitle>
          <CardDescription>
            Add a new user account and assign a role.
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

            {/* Password */}
            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Confirm Password */}
            <FormInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm the password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Role</Label>
              <div className="grid grid-cols-3 gap-3">
                {(["admin", "teacher", "student"] as const).map((role) => {
                  const icons: Record<string, typeof Shield> = {
                    admin: Shield,
                    teacher: User,
                    student: User,
                  };
                  const labels: Record<string, string> = {
                    admin: "Admin",
                    teacher: "Teacher",
                    student: "Student",
                  };
                  const RoleIcon = icons[role];

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
                      <span className="text-sm font-medium">{labels[role]}</span>
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
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
