import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { UserWithRole } from "../services/user.service";
import { UserActionsCell } from "./user-actions-cell";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipProvider>
            <TooltipTrigger>
              <span className="block w-[70px] truncate overflow-hidden text-ellipsis">
                {row.original.id}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{row.original.id}</span>
            </TooltipContent>
          </TooltipProvider>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      return (
        <Avatar className="size-10 rounded-full">
          <AvatarImage
            src={row.original.profileImageUrl}
            alt={row.original.fullName}
          />
          <AvatarFallback className="rounded-lg">
            {row.original.fullName.split(" ")?.[0]?.[0]}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => {
      return row.original.role.name || "-";
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return row.original.phone || "-";
    },
  },
  {
    accessorKey: "isBanned",
    header: "Is Banned",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isBanned ? "destructive" : "default"}>
          {row.original.isBanned ? "Banned" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "yyyy-MM-dd");
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
