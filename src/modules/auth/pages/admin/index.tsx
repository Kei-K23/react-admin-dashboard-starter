import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

export default function AdminIndexPage() {
  return (
    <div className="p-6">
      <section className="flex items-center justify-between">
        <div>
          <h3>Admin List</h3>
          <p>Total Admin: 20</p>
        </div>
        <Link to={"/administration/admin/create"}>
          <Button>
            <PlusIcon /> Create New Admin
          </Button>
        </Link>
      </section>
    </div>
  );
}
