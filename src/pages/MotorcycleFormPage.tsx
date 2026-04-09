import { useNavigate, useParams } from "react-router-dom";

import { MotorcycleForm } from "@/components/forms/MotorcycleForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";

export const MotorcycleFormPage = () => {
  const navigate = useNavigate();
  const { motorcycleId } = useParams();
  const { motorcycles, createMotorcycle, updateMotorcycle, isSaving } = useAppData();
  const motorcycle = motorcycles.find((item) => item.id === motorcycleId);
  const isEditing = Boolean(motorcycle);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit motorcycle" : "Add motorcycle"}
        description="Bike details drive the default service template and keep each maintenance record properly isolated."
      />
      <MotorcycleForm
        motorcycle={motorcycle}
        isSaving={isSaving}
        onSubmit={async (values) => {
          if (isEditing && motorcycle) {
            await updateMotorcycle(motorcycle.id, values);
          } else {
            await createMotorcycle(values);
          }
          navigate("/");
        }}
      />
    </div>
  );
};
