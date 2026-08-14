import Button from "./Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "@/components/ui/icons";

function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center p-6 text-center">
      <Alert variant="destructive" className="max-w-md text-left">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive" className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
