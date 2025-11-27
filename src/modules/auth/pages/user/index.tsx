"use no memo";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { columns } from "../../components/user-data-table-column";
import { UserDataTable } from "../../components/user-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGetAllUsers } from "../../hooks/use-user";

export default function UserIndexPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isBannedFilter, setIsBannedFilter] = useState<
    "all" | "true" | "false"
  >("all");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 800);
    return () => clearTimeout(id);
  }, [search]);

  const params = useMemo(
    () => ({
      page: String(page),
      limit: String(limit),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(isBannedFilter !== "all" ? { isBanned: isBannedFilter } : {}),
    }),
    [page, limit, debouncedSearch, isBannedFilter]
  );

  const { data: users, isLoading } = useGetAllUsers(params)(params);

  const total = users?.meta?.total || 0;
  const totalPages =
    users?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="p-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h3>User List</h3>
          <p className="text-sm text-muted-foreground">Total {total} users</p>
        </div>
        <Link to={"/administration/users/create"}>
          <Button>
            <PlusIcon /> Create New User
          </Button>
        </Link>
      </section>
      <section className="my-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-[220px]"
          />
          <Select
            value={isBannedFilter}
            onValueChange={(val) => {
              setIsBannedFilter(val as "all" | "true" | "false");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="mt-6">
        <UserDataTable columns={columns} data={users?.data || []} />
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
