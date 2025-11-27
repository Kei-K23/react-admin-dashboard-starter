import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useAuthStatus } from "@/modules/auth/hooks/use-auth";

export default function NotFound() {
  const { isAuthenticated } = useAuthStatus();
  const backHref = isAuthenticated ? "/" : "/auth/login";
  const backLabel = isAuthenticated ? "Back to Dashboard" : "Go to Login";

  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <Button asChild>
            <Link to={backHref}>{backLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
