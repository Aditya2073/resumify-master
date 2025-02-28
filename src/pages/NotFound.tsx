
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <FileWarning className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button>Return to Resume Builder</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
