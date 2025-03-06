
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { FileQuestionIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <FileQuestionIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </PageTransition>
  );
};

export default NotFound;
