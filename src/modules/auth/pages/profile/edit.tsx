"use no memo";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "../../hooks/use-user";
import { updateUserSchema } from "../../services/user.service";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useProfile } from "../../hooks/use-auth";

type FormValues = z.infer<typeof updateUserSchema>;

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useProfile();
  const updateMutation = useUpdateUser();
  const logout = useLogout();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: profile?.data?.fullName ?? "",
      email: profile?.data?.email ?? "",
      phone: profile?.data?.phone ?? "",
      password: undefined,
      profileImage: undefined,
    },
  });

  if (profile?.data && form.getValues("fullName") === "") {
    form.reset({
      fullName: profile.data.fullName ?? "",
      email: profile.data.email ?? "",
      phone: profile.data.phone ?? "",
      password: undefined,
      profileImage: undefined,
    });
  }

  const onSubmit = (values: FormValues) => {
    if (!profile?.data?.id) return;

    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.email) formData.append("email", values.email);
    if (values.phone) formData.append("phone", values.phone);
    if (values.password) formData.append("password", values.password);
    if (values.profileImage)
      formData.append("profileImage", values.profileImage);

    updateMutation.mutate(
      { id: profile.data.id, data: formData },
      {
        onSuccess: ({ message }) => {
          toast.success(message ?? "Profile updated successfully");
          queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });

          if (values.password) {
            toast.success(
              "Successfully updated password. Please log in again."
            );
            logout();
          }

          navigate("/account/profile");
        },
        onError: ({ response }) => {
          toast.error(response?.data?.message ?? "Failed to update profile");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <PageHeader
          backButton={{ label: "Back to Profile", to: "/account/profile" }}
        />
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !profile?.data) {
    return (
      <div className="p-6">
        <PageHeader
          backButton={{ label: "Back to Profile", to: "/account/profile" }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Failed to load profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please try again later or refresh the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        backButton={{ label: "Back to Profile", to: "/account/profile" }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave blank to keep old password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image (optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value as File | undefined}
                        onChange={field.onChange}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
