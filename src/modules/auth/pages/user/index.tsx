import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useGetAllUsers } from "../../hooks/use-user";
import { columns } from "../../components/user-data-table-column";
import { UserDataTable } from "../../components/user-data-table";

export default function UserIndexPage() {
  const { data: users } = useGetAllUsers();

  return (
    <div className="p-6">
      <section className="flex items-center justify-between">
        <div>
          <h3>User List</h3>
        </div>
        <Link to={"/administration/users/create"}>
          <Button>
            <PlusIcon /> Create New User
          </Button>
        </Link>
      </section>
      <section className="mt-10">
        <UserDataTable columns={columns} data={users?.data || []} />
      </section>
    </div>
  );
}
