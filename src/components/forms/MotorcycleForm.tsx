import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldWrapper, Input, Select } from "@/components/ui/Field";
import type { Motorcycle, MotorcycleFormValues } from "@/types/domain";

const motorcycleSchema = z.object({
  nickname: z.string().min(2, "Nickname is required"),
  plateNumber: z.string().min(4, "Plate number is required"),
  engineNumber: z.string().min(4, "Engine number is required"),
  chassisNumber: z.string().min(4, "Chassis number is required"),
  fuelType: z.enum(["bensin", "listrik"]),
  transmission: z.enum(["matic", "manual", "automatic", "single_speed"]),
  brand: z.string().optional(),
  model: z.string().optional(),
  productionYear: z.coerce.number().min(1980).max(2100).optional().or(z.nan().transform(() => undefined)),
  photoUrl: z.string().url("Photo must be a valid URL").optional().or(z.literal("")),
});

export const MotorcycleForm = ({
  motorcycle,
  onSubmit,
  isSaving,
}: {
  motorcycle?: Motorcycle;
  onSubmit: (values: MotorcycleFormValues) => Promise<void>;
  isSaving?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MotorcycleFormValues>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      nickname: motorcycle?.nickname ?? "",
      plateNumber: motorcycle?.plateNumber ?? "",
      engineNumber: motorcycle?.engineNumber ?? "",
      chassisNumber: motorcycle?.chassisNumber ?? "",
      fuelType: motorcycle?.fuelType ?? "bensin",
      transmission: motorcycle?.transmission ?? "matic",
      brand: motorcycle?.brand ?? "",
      model: motorcycle?.model ?? "",
      productionYear: motorcycle?.productionYear ?? undefined,
      photoUrl: motorcycle?.photoUrl ?? "",
    },
  });

  const selectedFuel = watch("fuelType");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      <Card className="grid gap-4 md:grid-cols-2">
        <FieldWrapper label="Nickname / Display name" error={errors.nickname?.message}>
          <Input {...register("nickname")} placeholder="Beat Harian" />
        </FieldWrapper>
        <FieldWrapper label="Plate number" error={errors.plateNumber?.message}>
          <Input {...register("plateNumber")} placeholder="B 1234 ABC" />
        </FieldWrapper>
        <FieldWrapper label="Engine number" error={errors.engineNumber?.message}>
          <Input {...register("engineNumber")} placeholder="ENG-123456" />
        </FieldWrapper>
        <FieldWrapper label="Chassis number" error={errors.chassisNumber?.message}>
          <Input {...register("chassisNumber")} placeholder="CHS-123456" />
        </FieldWrapper>
        <FieldWrapper label="Fuel type" error={errors.fuelType?.message}>
          <Select {...register("fuelType")}>
            <option value="bensin">Bensin</option>
            <option value="listrik">Listrik</option>
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Transmission" error={errors.transmission?.message}>
          <Select {...register("transmission")}>
            {selectedFuel === "listrik" ? (
              <>
                <option value="single_speed">Single speed</option>
                <option value="automatic">Automatic</option>
              </>
            ) : (
              <>
                <option value="matic">Matic</option>
                <option value="manual">Manual</option>
              </>
            )}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Brand" error={errors.brand?.message}>
          <Input {...register("brand")} placeholder="Honda" />
        </FieldWrapper>
        <FieldWrapper label="Model" error={errors.model?.message}>
          <Input {...register("model")} placeholder="Beat CBS" />
        </FieldWrapper>
        <FieldWrapper label="Year" error={errors.productionYear?.message}>
          <Input type="number" {...register("productionYear", { valueAsNumber: true })} placeholder="2024" />
        </FieldWrapper>
        <FieldWrapper label="Photo URL" error={errors.photoUrl?.message}>
          <Input {...register("photoUrl")} placeholder="https://..." />
        </FieldWrapper>
      </Card>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : motorcycle ? "Update motorcycle" : "Create motorcycle"}
      </Button>
    </form>
  );
};
