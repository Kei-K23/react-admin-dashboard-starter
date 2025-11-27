import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, EditIcon, MoreHorizontal, ViewIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { UserWithRole } from "../services/user.service";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "../hooks/use-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfile } from "../hooks/use-auth";

interface Props {
  user: UserWithRole;
}

export function UserActionsCell({ user }: Props) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteUser();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: profile } = useProfile();

  const onView = () => navigate(`/administration/users/${user.id}`);
  const onEdit = () => navigate(`/administration/users/${user.id}/edit`);
  const onDelete = () => setConfirmOpen(true);

  const confirmDelete = () => {
    if (profile?.data?.id === user.id) {
      toast.error("You cannot delete yourself");
      return;
    }
    deleteMutation.mutate(user.id, {
      onSuccess: ({ data }) => {
        toast.success(data.message);
        setConfirmOpen(false);
      },
      onError: ({ response }) => {
        toast.error(response.data.message);
        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onView} className="cursor-pointer">
            <ViewIcon /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <EditIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
          >
            <DeleteIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will permanently delete the user "{user.fullName}" and revoke
              their access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
