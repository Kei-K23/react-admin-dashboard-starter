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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser, useGetUserById } from "../../hooks/use-user";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";
import { updateUserSchema } from "../../services/user.service";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = z.infer<typeof updateUserSchema>;

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: roles } = useGetAllRoles()();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById(id || "")({ id: id || "" });
  const updateMutation = useUpdateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.data?.fullName ?? "",
      email: user?.data?.email ?? "",
      phone: user?.data?.phone ?? "",
      roleId: user?.data?.roleId ?? "",
      password: undefined,
      profileImage: undefined,
    },
  });

  if (user?.data && form.getValues("fullName") === "") {
    form.reset({
      fullName: user.data.fullName ?? "",
      email: user.data.email ?? "",
      phone: user.data.phone ?? "",
      roleId: user.data.roleId ?? "",
      password: undefined,
      profileImage: undefined,
    });
  }

  const onSubmit = (values: FormValues) => {
    // Decide payload format based on presence of image

    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.email) formData.append("email", values.email);
    if (values.phone) formData.append("phone", values.phone);
    if (values.roleId) formData.append("roleId", values.roleId);
    if (values.password) formData.append("password", values.password);
    if (values.profileImage)
      formData.append("profileImage", values.profileImage);

    updateMutation.mutate(
      { id: id || "", data: formData },
      {
        onSuccess: ({ message }) => {
          toast.success(message ?? "User updated successfully");
          queryClient.invalidateQueries({ queryKey: ["users"] });
          queryClient.invalidateQueries({
            queryKey: ["users", "detail", id],
          });
          navigate(`/administration/users/${id}`);
        },
        onError: ({ response }) => {
          toast.error(response?.data?.message ?? "Failed to update user");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <PageHeader
          backButton={{ label: "Back to Users", to: "/administration/users" }}
        />
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <PageHeader
          backButton={{ label: "Back to Users", to: "/administration/users" }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Failed to load user</CardTitle>
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
        backButton={{
          label: "Back to User",
          to: `/administration/users/${id}`,
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
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
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={updateMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(roles?.data || []).map((r) => (
                          <SelectItem value={r.id} key={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        initialUrl={user?.data?.profileImageUrl}
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
