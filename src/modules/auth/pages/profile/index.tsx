import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useProfile } from "../../hooks/use-auth";
import { format } from "date-fns";
import { EditIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteUser } from "../../hooks/use-user";
import { useLogout } from "../../hooks/use-auth";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const deleteMutation = useDeleteUser();
  const logout = useLogout();

  if (isLoading) {
    return <div className="p-6">Loading profile…</div>;
  }

  if (isError || !profile?.data) {
    return <div className="p-6">Unable to load profile.</div>;
  }

  const user = profile.data;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
            <AvatarFallback>
              {user.fullName?.split(" ")?.[0]?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{user.fullName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{user.role?.name}</Badge>
              {user.isBanned ? (
                <Badge variant="destructive">Banned</Badge>
              ) : (
                <Badge>Active</Badge>
              )}
            </div>
          </div>
          <CardAction>
            <Button asChild variant="outline" size="sm">
              <Link to="/account/profile/edit">
                <EditIcon />
                Edit Profile
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="ml-2">
                  <TrashIcon />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action is permanent and cannot be undone. Your account
                    and all associated data will be removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      deleteMutation.mutate(profile!.data.id, {
                        onSuccess: ({ message }) => {
                          toast.success(
                            message ?? "Account deleted successfully"
                          );
                          logout();
                        },
                        onError: ({ response }) => {
                          toast.error(
                            response?.data?.message ??
                              "Failed to delete account"
                          );
                        },
                      });
                    }}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="font-medium">{user.phone || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Two-factor</div>
            <div className="font-medium">
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Last Login</div>
            <div className="font-medium">
              {user.lastLoginAt
                ? format(new Date(user.lastLoginAt), "yyyy-MM-dd HH:mm")
                : "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Member Since</div>
            <div className="font-medium">
              {user.createdAt
                ? format(new Date(user.createdAt), "yyyy-MM-dd")
                : "-"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
