import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <LoaderPinwheel className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}
