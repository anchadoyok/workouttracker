import { Gauge, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Motorcycle } from "@/types/domain";

export const MotorcycleCard = ({
  motorcycle,
  isSelected,
  onSelect,
  onDelete,
}: {
  motorcycle: Motorcycle;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) => (
  <Card className={isSelected ? "ring-2 ring-brand-400" : ""}>
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{motorcycle.nickname}</h3>
          <p className="text-sm text-stone-500">{motorcycle.plateNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-stone-500">
          <span className="rounded-full bg-stone-100 px-3 py-1">{motorcycle.brand || "Brand n/a"}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{motorcycle.model || "Model n/a"}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{motorcycle.fuelType}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{motorcycle.transmission}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-accent-50 p-3 text-accent-700">
        <Gauge className="h-5 w-5" />
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      <Button variant={isSelected ? "primary" : "secondary"} onClick={onSelect}>
        {isSelected ? "Selected" : "Select"}
      </Button>
      <Link to={`/motorcycles/${motorcycle.id}/edit`}>
        <Button variant="ghost">
          <PencilLine className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </Link>
      <Button variant="ghost" className="text-rose-600" onClick={onDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  </Card>
);
