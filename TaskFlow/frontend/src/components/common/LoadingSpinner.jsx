import { Loader2 } from "@/components/ui/icons";

function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading TaskFlow...</p>
    </div>
  );
}

export default LoadingSpinner;
