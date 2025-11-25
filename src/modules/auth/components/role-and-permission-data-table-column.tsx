import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "../services/role-and-permissions-service";
import { format } from "date-fns";
import { RoleAndPermissionActionsCell } from "./role-and-permission-actions-cell";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.original.description || "-";
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
    cell: ({ row }) => <RoleAndPermissionActionsCell role={row.original} />,
  },
];
