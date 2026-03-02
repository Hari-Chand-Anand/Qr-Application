import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-red-600" />
    </div>
  );
}
