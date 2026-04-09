import { Link } from "react-router-dom";

import { MotorcycleCard } from "@/components/MotorcycleCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/Feedback";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";

export const HomePage = () => {
  const { motorcycles, selectedMotorcycleId, selectMotorcycle, deleteMotorcycle, error } = useAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your motorcycles"
        description="Keep each commuter bike isolated so service schedules and cost history stay accurate."
        action={
          <Link to="/motorcycles/new">
            <Button>Add motorcycle</Button>
          </Link>
        }
      />

      {error ? <ErrorState message={error} /> : null}

      {motorcycles.length === 0 ? (
        <EmptyState
          title="No motorcycles yet"
          description="Create the first motorcycle to unlock dashboard tracking, service logs, and odometer history."
          action={
            <Link to="/motorcycles/new">
              <Button>Add first motorcycle</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {motorcycles.map((motorcycle) => (
            <MotorcycleCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              isSelected={motorcycle.id === selectedMotorcycleId}
              onSelect={() => selectMotorcycle(motorcycle.id)}
              onDelete={() => void deleteMotorcycle(motorcycle.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
