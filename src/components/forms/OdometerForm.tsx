import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import type { OdometerFormValues, OdometerRecord } from "@/types/domain";
import { toDateInputValue } from "@/utils/date";

const odometerSchema = z.object({
  recordedAt: z.string().min(1, "Date is required"),
  odometer: z.coerce.number().min(0, "Odometer must be non-negative"),
  notes: z.string().optional(),
});

export const OdometerForm = ({
  record,
  onSubmit,
  onCancel,
  isSaving,
}: {
  record?: OdometerRecord;
  onSubmit: (values: OdometerFormValues) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OdometerFormValues>({
    resolver: zodResolver(odometerSchema),
    defaultValues: {
      recordedAt: toDateInputValue(record?.recordedAt),
      odometer: record?.odometer ?? 0,
      notes: record?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))}>
      <Card className="space-y-4">
        <FieldWrapper label="Record date" error={errors.recordedAt?.message}>
          <Input type="date" {...register("recordedAt")} />
        </FieldWrapper>
        <FieldWrapper label="Odometer (km)" error={errors.odometer?.message}>
          <Input type="number" {...register("odometer", { valueAsNumber: true })} />
        </FieldWrapper>
        <FieldWrapper label="Notes" error={errors.notes?.message}>
          <Textarea {...register("notes")} placeholder="Optional observation" />
        </FieldWrapper>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : record ? "Update record" : "Add record"}
          </Button>
          {onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>
    </form>
  );
};
