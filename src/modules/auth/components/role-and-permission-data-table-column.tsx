"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "../services/role-and-permissions-service";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
