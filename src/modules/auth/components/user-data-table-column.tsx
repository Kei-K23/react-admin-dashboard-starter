import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { UserWithRole } from "../services/user.service";
import { UserActionsCell } from "./user-actions-cell";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <span className="truncate w-24">{row.original.id}</span>;
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
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
