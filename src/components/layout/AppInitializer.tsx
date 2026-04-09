import { useEffect, type ReactNode } from "react";

import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { useAppData } from "@/hooks/useAppData";

export const AppInitializer = ({ children }: { children: ReactNode }) => {
  const { initialize, isBootstrapping, error, motorcycles } = useAppData();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (isBootstrapping) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
        <LoadingState message="Preparing your commuter maintenance workspace..." />
      </div>
    );
  }

  if (error && motorcycles.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
        <ErrorState message={error} />
      </div>
    );
  }

  return <>{children}</>;
};
