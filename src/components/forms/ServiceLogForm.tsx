import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import type { ServiceComponent, ServiceLog, ServiceLogFormValues } from "@/types/domain";
import { toDateInputValue } from "@/utils/date";

const serviceLogSchema = z.object({
  serviceDate: z.string().min(1, "Service date is required"),
  odometer: z.coerce.number().min(0, "Odometer must be non-negative"),
  serviceType: z.string().min(2, "Service type is required"),
  workshop: z.string().min(2, "Workshop is required"),
  cost: z.coerce.number().min(0, "Cost must be non-negative"),
  notes: z.string().optional(),
  nextReminderDate: z.string().optional(),
  componentIds: z.array(z.string()).min(1, "Pick at least one serviced component"),
});

export const ServiceLogForm = ({
  serviceLog,
  components,
  onSubmit,
  isSaving,
}: {
  serviceLog?: ServiceLog;
  components: ServiceComponent[];
  onSubmit: (values: ServiceLogFormValues) => Promise<void>;
  isSaving?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ServiceLogFormValues>({
    resolver: zodResolver(serviceLogSchema),
    defaultValues: {
      serviceDate: toDateInputValue(serviceLog?.serviceDate),
      odometer: serviceLog?.odometer ?? 0,
      serviceType: serviceLog?.serviceType ?? "",
      workshop: serviceLog?.workshop ?? "",
      cost: serviceLog?.cost ?? 0,
      notes: serviceLog?.notes ?? "",
      nextReminderDate: toDateInputValue(serviceLog?.nextReminderDate),
      componentIds: serviceLog?.componentIds ?? [],
    },
  });

  const selectedComponents = watch("componentIds");

  const toggleComponent = (componentId: string) => {
    const next = selectedComponents.includes(componentId)
      ? selectedComponents.filter((id) => id !== componentId)
      : [...selectedComponents, componentId];
    setValue("componentIds", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      <Card className="grid gap-4 md:grid-cols-2">
        <FieldWrapper label="Service date" error={errors.serviceDate?.message}>
          <Input type="date" {...register("serviceDate")} />
        </FieldWrapper>
        <FieldWrapper label="Odometer (km)" error={errors.odometer?.message}>
          <Input type="number" {...register("odometer", { valueAsNumber: true })} />
        </FieldWrapper>
        <FieldWrapper label="Service type" error={errors.serviceType?.message}>
          <Input {...register("serviceType")} placeholder="Servis rutin" />
        </FieldWrapper>
        <FieldWrapper label="Workshop" error={errors.workshop?.message}>
          <Input {...register("workshop")} placeholder="AHASS Tebet" />
        </FieldWrapper>
        <FieldWrapper label="Cost" error={errors.cost?.message}>
          <Input type="number" {...register("cost", { valueAsNumber: true })} />
        </FieldWrapper>
        <FieldWrapper label="Next reminder date" error={errors.nextReminderDate?.message}>
          <Input type="date" {...register("nextReminderDate")} />
        </FieldWrapper>
        <div className="md:col-span-2">
          <FieldWrapper label="Notes" error={errors.notes?.message}>
            <Textarea {...register("notes")} placeholder="Anything important from the visit" />
          </FieldWrapper>
        </div>
      </Card>

      <Card>
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-stone-950">Serviced components</h3>
          <p className="text-sm text-stone-500">Used to update dashboard component health.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {components.map((component) => (
            <label
              key={component.id}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                selectedComponents.includes(component.id)
                  ? "border-brand-400 bg-brand-50"
                  : "border-stone-200 bg-stone-50"
              }`}
            >
              <span>
                <span className="block font-medium text-stone-900">{component.name}</span>
                <span className="text-xs text-stone-500">
                  {component.kmInterval} km / {component.timeIntervalDays} days
                </span>
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-700"
                checked={selectedComponents.includes(component.id)}
                onChange={() => toggleComponent(component.id)}
              />
            </label>
          ))}
        </div>
        {errors.componentIds?.message ? (
          <p className="mt-3 text-sm font-medium text-rose-600">{errors.componentIds.message}</p>
        ) : null}
      </Card>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : serviceLog ? "Update service entry" : "Save service entry"}
      </Button>
    </form>
  );
};
