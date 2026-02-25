import { Loader2, LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-muted rounded-full">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    </div>
  );
}
