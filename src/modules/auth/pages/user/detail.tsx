"use no memo";

import { useParams, Link } from "react-router";
import { useGetUserById } from "@/modules/auth/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, EditIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById(id || "")({ id: id || "" });

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        backButton={{ label: "Back to Users", to: "/administration/users" }}
        actions={
          user
            ? [
                <Button asChild variant="secondary" key="edit">
                  <Link to={`/administration/users/${user.data.id}/edit`}>
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
              Failed to load user details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please try again later or refresh the page.</p>
          </CardContent>
        </Card>
      )}

      {user?.data && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>User Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user.data.profileImageUrl} />
                  <AvatarFallback>
                    {user.data.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user.data.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.data.email}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="text-sm">{user.data.phone || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Role</div>
                  <div className="text-sm">{user.data.role?.name || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm">
                    {new Date(user.data.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Updated</div>
                  <div className="text-sm">
                    {new Date(user.data.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Security */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Status & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={user.data.isBanned ? "destructive" : "secondary"}
                >
                  {user.data.isBanned ? "Banned" : "Active"}
                </Badge>
                <Badge
                  variant={user.data.twoFactorEnabled ? "secondary" : "outline"}
                >
                  {user.data.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Last Login
                  </div>
                  <div className="text-sm">
                    {user.data.lastLoginAt
                      ? new Date(user.data.lastLoginAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(!user.data.role?.rolePermissions ||
                user.data.role.rolePermissions.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  This user’s role has no permissions yet.
                </p>
              )}

              {user.data.role?.rolePermissions &&
                user.data.role.rolePermissions.length > 0 && (
                  <div className="space-y-6">
                    {Object.entries(
                      user.data.role.rolePermissions.reduce<
                        Record<string, typeof user.data.role.rolePermissions>
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
