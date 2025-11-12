import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

export default function RoleAndPermissionsIndexPage() {
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
    </div>
  );
}
