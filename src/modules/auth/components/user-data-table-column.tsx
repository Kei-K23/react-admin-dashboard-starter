import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { UserWithRole } from "../services/user.service";

export const columns: ColumnDef<UserWithRole>[] = [
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "yyyy-MM-dd");
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <RoleAndPermissionActionsCell role={row.original} />,
  // },
];
