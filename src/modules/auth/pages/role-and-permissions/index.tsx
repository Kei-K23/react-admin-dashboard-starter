import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { RoleAndPermissionDataTable } from "../../components/role-and-permission-data-table";
import { columns } from "../../components/role-and-permission-data-table-column";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";

export default function RoleAndPermissionsIndexPage() {
  const { data: roles } = useGetAllRoles();

  return (
    <div className="p-6">
      <section className="flex items-center justify-between">
        <div>
          <h3>Role & Permissions</h3>
        </div>
        <Link to={"/administration/role-permissions/create"}>
          <Button>
            <PlusIcon /> Create New Role
          </Button>
        </Link>
      </section>
      <section className="mt-10">
        <RoleAndPermissionDataTable
          columns={columns}
          data={roles?.data || []}
        />
      </section>
    </div>
  );
}
