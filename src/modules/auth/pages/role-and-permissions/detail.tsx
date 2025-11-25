"use no memo";

import { useParams, Link } from "react-router";
import { useGetRoleById } from "@/modules/auth/hooks/use-role-and-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, EditIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: role,
    isLoading,
    isError,
  } = useGetRoleById(id || "")({ id: id || "" });

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        backButton={{
          label: "Back to Roles",
          to: "/administration/role-permissions",
        }}
        actions={
          role
            ? [
                <Button asChild variant="secondary" key="edit">
                  <Link
                    to={`/administration/role-permissions/${role.data.id}/edit`}
                  >
                    <EditIcon />
                    Edit
                  </Link>
                </Button>,
              ]
            : []
        }
      />

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Failed to load role details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please try again later or refresh the page.</p>
          </CardContent>
        </Card>
      )}

      {role?.data && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-base font-medium">{role.data.name}</p>
              </div>
              {role.data.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-base">{role.data.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  Permissions Count
                </p>
                <p className="text-base font-medium">
                  {role.data.rolePermissions?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Permissions Information</CardTitle>
            </CardHeader>
            <CardContent>
              {(!role.data.rolePermissions ||
                role.data.rolePermissions.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  This role has no permissions yet.
                </p>
              )}

              {role.data.rolePermissions &&
                role.data.rolePermissions.length > 0 && (
                  <div className="space-y-6">
                    {/* Group permissions by module */}
                    {Object.entries(
                      role.data.rolePermissions.reduce<
                        Record<string, typeof role.data.rolePermissions>
                      >((acc, rp) => {
                        const module = rp.permission.module;
                        acc[module] = acc[module] || [];
                        acc[module].push(rp);
                        return acc;
                      }, {})
                    ).map(([module, modulePermissions]) => (
                      <div key={module} className="space-y-2">
                        <h3 className="text-sm font-semibold">{module}</h3>
                        <div className="flex flex-wrap gap-2">
                          {modulePermissions.map((rp) => (
                            <Badge key={rp.permission.id} variant="secondary">
                              {rp.permission.permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
