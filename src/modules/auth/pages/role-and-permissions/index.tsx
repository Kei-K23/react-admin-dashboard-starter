"use no memo";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { RoleAndPermissionDataTable } from "../../components/role-and-permission-data-table";
import { columns } from "../../components/role-and-permission-data-table-column";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RoleAndPermissionsIndexPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const params = useMemo(
    () => ({
      page: String(page),
      limit: String(limit),
    }),
    [page, limit]
  );

  const { data: roles, isLoading } = useGetAllRoles(params)(params);

  const total = roles?.meta?.total || 0;
  const totalPages =
    roles?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="p-6">
      <section className="flex items-center justify-between">
        <div>
          <h3>Role & Permissions</h3>
          <p className="text-sm text-muted-foreground">Total {total} roles</p>
        </div>
        <Link to={"/administration/role-permissions/create"}>
          <Button>
            <PlusIcon /> Create New Role
          </Button>
        </Link>
      </section>
      <section className="mt-6">
        <RoleAndPermissionDataTable
          columns={columns}
          data={roles?.data || []}
        />
      </section>
      <section className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev || isLoading}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext || isLoading}
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}
