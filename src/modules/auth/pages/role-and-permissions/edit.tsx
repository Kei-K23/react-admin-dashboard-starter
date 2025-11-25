import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  useGetAllPermissions,
  useGetRoleById,
  useUpdateRole,
} from "../../hooks/use-role-and-permissions";
import {
  updateRoleSchema,
  PermissionEnum,
} from "../../services/role-and-permissions-service";
import { useQueryClient } from "@tanstack/react-query";

const permissionKeys = [
  PermissionEnum.Create,
  PermissionEnum.Read,
  PermissionEnum.Update,
  PermissionEnum.Delete,
] as const;

const schema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.any(),
});

type FormValues = z.infer<typeof schema>;

export default function RoleAndPermissionsEditPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data: role,
    isLoading: roleLoading,
    isError: roleError,
  } = useGetRoleById(id || "")({ id: id || "" });
  const { data: permissions, isLoading: permLoading } = useGetAllPermissions();
  const updateRoleMutation = useUpdateRole();

  const apiModules = Array.from(
    new Set(permissions?.data?.map((p) => p.module) ?? [])
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.data?.name ?? "",
      description: role?.data?.description ?? "",
      permissions: permissions?.data?.reduce((acc, p) => {
        acc[p.module] = acc[p.module] || {
          [PermissionEnum.Create]: false,
          [PermissionEnum.Read]: false,
          [PermissionEnum.Update]: false,
          [PermissionEnum.Delete]: false,
        };
        // Pre-check if this role has the permission
        const selectedIds = new Set(
          role?.data?.rolePermissions?.map((rp) => rp.permissionId) ?? []
        );
        acc[p.module][p.permission] = selectedIds.has(p.id);
        return acc;
      }, {} as FormValues["permissions"]),
    },
  });

  // Reset defaults when role or permissions load asynchronously
  useEffect(() => {
    if (!role?.data || !permissions?.data) return;
    const selectedIds = new Set(
      role.data.rolePermissions?.map((rp) => rp.permissionId) ?? []
    );

    const defaults = permissions.data.reduce((acc, p) => {
      acc[p.module] = acc[p.module] || {
        [PermissionEnum.Create]: false,
        [PermissionEnum.Read]: false,
        [PermissionEnum.Update]: false,
        [PermissionEnum.Delete]: false,
      };
      acc[p.module][p.permission] = selectedIds.has(p.id);
      return acc;
    }, {} as FormValues["permissions"]);

    form.reset({
      name: role.data.name ?? "",
      description: role.data.description ?? "",
      permissions: defaults,
    });
  }, [role?.data, permissions?.data]);

  const onSubmit = (values: FormValues) => {
    if (!id) return;

    // Transform to list of selected permissions
    const selectedPermissionIds = (permissions?.data ?? [])
      .filter((perm) => values.permissions?.[perm.module]?.[perm.permission])
      .map((perm) => perm.id);

    const payload = {
      id,
      name: values.name,
      description: values.description,
      permissionIds: selectedPermissionIds,
    };

    try {
      updateRoleSchema.parse({
        name: payload.name,
        description: payload.description,
        permissionIds: payload.permissionIds,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues.map((i) => i.message).join(", "));
      } else {
        toast.error("Validation error");
      }
      return;
    }

    updateRoleMutation.mutate(payload, {
      onSuccess: ({ message }) => {
        toast.success(message);
        // Revalidate list and this role's detail
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        queryClient.invalidateQueries({ queryKey: ["roles", "detail", id] });

        navigate(`/administration/role-permissions/${id}`);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  if (roleLoading || permLoading) {
    return (
      <div className="p-6 space-y-6">
        <section className="flex items-center justify-between">
          <Link to={"/administration/role-permissions"}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h3 className="text-lg font-semibold">Edit Role</h3>
          </div>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Loading role details...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roleError) {
    return (
      <div className="p-6 space-y-6">
        <section className="flex items-center justify-between">
          <Link to={"/administration/role-permissions"}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h3 className="text-lg font-semibold">Edit Role</h3>
          </div>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Error loading role details</CardTitle>
          </CardHeader>
          <CardContent>Please refresh and try again.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <section className="flex items-center justify-between">
        <Link to={"/administration/role-permissions"}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h3 className="text-lg font-semibold">Edit Role</h3>
        </div>
      </section>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Administrator" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiModules.map((mod) => (
                    <TableRow key={mod}>
                      <TableCell className="font-medium">{mod}</TableCell>
                      {permissionKeys.map((perm) => (
                        <TableCell key={perm} className="text-center">
                          <Controller
                            control={form.control}
                            name={`permissions.${mod}.${perm}` as const}
                            render={({ field }) => (
                              <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(val) =>
                                  field.onChange(Boolean(val))
                                }
                                aria-label={`${mod} ${perm}`}
                                disabled={
                                  !permissions?.data?.some(
                                    (p) =>
                                      p.module === mod && p.permission === perm
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={updateRoleMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
