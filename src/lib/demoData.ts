import { addDays, subDays } from "date-fns";

import { getTemplateComponents } from "@/constants/componentTemplates";
import { generateId } from "@/lib/utils";
import type { Motorcycle, OdometerRecord, Profile, ServiceComponent, ServiceLog } from "@/types/domain";

const demoUserId = "demo-user";
const today = new Date();

const motorcycleOneId = generateId();
const motorcycleTwoId = generateId();

const motorcycles: Motorcycle[] = [
  {
    id: motorcycleOneId,
    userId: demoUserId,
    nickname: "Beat Harian",
    plateNumber: "B 1234 KTA",
    engineNumber: "ENG-001-ABC",
    chassisNumber: "CHS-001-ABC",
    fuelType: "bensin",
    transmission: "matic",
    brand: "Honda",
    model: "Beat CBS",
    productionYear: 2022,
    photoUrl: "",
    createdAt: subDays(today, 220).toISOString(),
    updatedAt: subDays(today, 2).toISOString(),
  },
  {
    id: motorcycleTwoId,
    userId: demoUserId,
    nickname: "GESITS Kantor",
    plateNumber: "B 8891 EV",
    engineNumber: "EV-MOTOR-8891",
    chassisNumber: "EV-CHASSIS-8891",
    fuelType: "listrik",
    transmission: "single_speed",
    brand: "GESITS",
    model: "Raya",
    productionYear: 2024,
    photoUrl: "",
    createdAt: subDays(today, 120).toISOString(),
    updatedAt: subDays(today, 3).toISOString(),
  },
];

const serviceComponents: ServiceComponent[] = motorcycles.flatMap((motorcycle) =>
  getTemplateComponents(motorcycle.fuelType, motorcycle.transmission).map((template, index) => ({
    id: `${motorcycle.id}-component-${index + 1}`,
    userId: demoUserId,
    motorcycleId: motorcycle.id,
    name: template.name,
    kmInterval: template.defaultKmInterval,
    timeIntervalDays: template.defaultTimeIntervalDays,
    warningThreshold: template.warningThreshold,
    notes: template.notes,
    createdAt: motorcycle.createdAt,
    updatedAt: motorcycle.updatedAt,
  })),
);

const componentIdsByMotorcycle = new Map<string, string[]>();
serviceComponents.forEach((component) => {
  const current = componentIdsByMotorcycle.get(component.motorcycleId) ?? [];
  current.push(component.id);
  componentIdsByMotorcycle.set(component.motorcycleId, current);
});

const serviceLogs: ServiceLog[] = [
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleOneId,
    serviceDate: subDays(today, 45).toISOString(),
    odometer: 12850,
    serviceType: "Servis Rutin",
    workshop: "AHASS Tebet",
    cost: 185000,
    notes: "Ganti oli mesin dan cek rem depan.",
    nextReminderDate: addDays(subDays(today, 45), 60).toISOString(),
    componentIds: componentIdsByMotorcycle.get(motorcycleOneId)?.slice(0, 2) ?? [],
    createdAt: subDays(today, 45).toISOString(),
    updatedAt: subDays(today, 45).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleOneId,
    serviceDate: subDays(today, 110).toISOString(),
    odometer: 10350,
    serviceType: "Ban dan Rem",
    workshop: "Bengkel Nusantara",
    cost: 420000,
    notes: "Ban belakang ganti, rem belakang dibersihkan.",
    nextReminderDate: null,
    componentIds: (componentIdsByMotorcycle.get(motorcycleOneId) ?? []).slice(3, 5),
    createdAt: subDays(today, 110).toISOString(),
    updatedAt: subDays(today, 110).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleTwoId,
    serviceDate: subDays(today, 35).toISOString(),
    odometer: 3120,
    serviceType: "Inspection",
    workshop: "Authorized EV Service",
    cost: 150000,
    notes: "Battery health check and brake pad inspection.",
    nextReminderDate: addDays(subDays(today, 35), 90).toISOString(),
    componentIds: (componentIdsByMotorcycle.get(motorcycleTwoId) ?? []).slice(0, 2),
    createdAt: subDays(today, 35).toISOString(),
    updatedAt: subDays(today, 35).toISOString(),
  },
];

const odometerRecords: OdometerRecord[] = [
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleOneId,
    recordedAt: subDays(today, 150).toISOString(),
    odometer: 9050,
    notes: "Awal tracking",
    createdAt: subDays(today, 150).toISOString(),
    updatedAt: subDays(today, 150).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleOneId,
    recordedAt: subDays(today, 75).toISOString(),
    odometer: 11640,
    notes: "Cek bulanan",
    createdAt: subDays(today, 75).toISOString(),
    updatedAt: subDays(today, 75).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleOneId,
    recordedAt: subDays(today, 3).toISOString(),
    odometer: 13980,
    notes: "Sebelum hujan besar",
    createdAt: subDays(today, 3).toISOString(),
    updatedAt: subDays(today, 3).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleTwoId,
    recordedAt: subDays(today, 90).toISOString(),
    odometer: 1180,
    notes: "First office commute",
    createdAt: subDays(today, 90).toISOString(),
    updatedAt: subDays(today, 90).toISOString(),
  },
  {
    id: generateId(),
    userId: demoUserId,
    motorcycleId: motorcycleTwoId,
    recordedAt: subDays(today, 12).toISOString(),
    odometer: 3560,
    notes: "Battery charged overnight",
    createdAt: subDays(today, 12).toISOString(),
    updatedAt: subDays(today, 12).toISOString(),
  },
];

export const demoSeed = {
  profile: {
    id: demoUserId,
    isAnonymous: true,
    displayName: "Demo rider",
    createdAt: subDays(today, 240).toISOString(),
    updatedAt: today.toISOString(),
  } satisfies Profile,
  motorcycles,
  serviceComponents,
  serviceLogs,
  odometerRecords,
};
