import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface BackButtonProps {
  label: string;
  to: string;
}

interface PageHeaderProps {
  backButton?: BackButtonProps;
  actions?: ReactNode[];
}

export function PageHeader({ backButton, actions }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {backButton && (
          <Button asChild variant="ghost" size="sm" className="mt-1">
            <Link to={backButton.to}>
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1">{backButton.label}</span>
            </Link>
          </Button>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((a, i) => (
            <div key={i}>{a}</div>
          ))}
        </div>
      )}
    </header>
  );
}
