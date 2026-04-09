import { useNavigate, useParams } from "react-router-dom";

import { ServiceLogForm } from "@/components/forms/ServiceLogForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";

export const ServiceLogFormPage = () => {
  const navigate = useNavigate();
  const { serviceLogId } = useParams();
  const { selectedMotorcycle, selectedComponents, selectedLogs, createServiceLog, updateServiceLog, isSaving } = useAppData();
  const serviceLog = selectedLogs.find((item) => item.id === serviceLogId);

  if (!selectedMotorcycle) {
    return (
      <EmptyState
        title="Select a motorcycle"
        description="Pick the target motorcycle before adding or editing a service entry."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={serviceLog ? "Edit service entry" : "Add service entry"}
        description="Every entry can update multiple tracked components so the dashboard stays accurate."
      />
      <ServiceLogForm
        serviceLog={serviceLog}
        components={selectedComponents}
        isSaving={isSaving}
        onSubmit={async (values) => {
          if (serviceLog) {
            await updateServiceLog(serviceLog.id, values);
          } else {
            await createServiceLog(values);
          }
          navigate("/service-log");
        }}
      />
    </div>
  );
};
