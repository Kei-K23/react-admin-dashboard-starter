import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, EditIcon, MoreHorizontal, ViewIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { Role } from "../services/role-and-permissions-service";
import { toast } from "sonner";
import { useDeleteRole } from "../hooks/use-role-and-permissions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  role: Role;
}

export function RoleAndPermissionActionsCell({ role }: Props) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteRole();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onView = () => navigate(`/administration/role-permissions/${role.id}`);

  const onEdit = () =>
    navigate(`/administration/role-permissions/${role.id}/edit`);

  const onDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(role.id, {
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
          <DropdownMenuItem onClick={onView}>
            <ViewIcon className="h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <EditIcon className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            <DeleteIcon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              This will permanently delete the role "{role.name}" and remove its
              permissions.
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
