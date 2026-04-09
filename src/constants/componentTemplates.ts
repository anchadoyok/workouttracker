import type { ComponentTemplate, FuelType, MaintenanceProfile, TransmissionType } from "@/types/domain";

export const componentTemplates: ComponentTemplate[] = [
  { profile: "bensin_matic", name: "Oli Mesin", defaultKmInterval: 2000, defaultTimeIntervalDays: 60, warningThreshold: 250, notes: "Ganti lebih cepat bila sering macet." },
  { profile: "bensin_matic", name: "Oli Gardan", defaultKmInterval: 6000, defaultTimeIntervalDays: 180, warningThreshold: 500, notes: "Pantau kebocoran dan suara kasar." },
  { profile: "bensin_matic", name: "CVT / Roller", defaultKmInterval: 12000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Inspeksi belt, roller, dan rumah CVT." },
  { profile: "bensin_matic", name: "Kampas Rem", defaultKmInterval: 8000, defaultTimeIntervalDays: 180, warningThreshold: 500, notes: "Pastikan ketebalan pad aman." },
  { profile: "bensin_matic", name: "Ban", defaultKmInterval: 12000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Cek aus dan tekanan angin." },
  { profile: "bensin_matic", name: "Aki", defaultKmInterval: 18000, defaultTimeIntervalDays: 540, warningThreshold: 1500, notes: "Pantau starter lemah dan terminal." },
  { profile: "bensin_matic", name: "Filter Udara", defaultKmInterval: 12000, defaultTimeIntervalDays: 180, warningThreshold: 1000, notes: "Bersihkan lebih sering jika berdebu." },
  { profile: "bensin_matic", name: "Busi", defaultKmInterval: 8000, defaultTimeIntervalDays: 240, warningThreshold: 500, notes: "Periksa pembakaran dan kerak." },
  { profile: "bensin_manual", name: "Oli Mesin", defaultKmInterval: 2500, defaultTimeIntervalDays: 60, warningThreshold: 250, notes: "Sesuaikan interval untuk pemakaian berat." },
  { profile: "bensin_manual", name: "Rantai dan Gear", defaultKmInterval: 12000, defaultTimeIntervalDays: 240, warningThreshold: 1000, notes: "Lumasi rantai di antara servis." },
  { profile: "bensin_manual", name: "Kampas Rem", defaultKmInterval: 8000, defaultTimeIntervalDays: 180, warningThreshold: 500, notes: "Pastikan respons pengereman tetap baik." },
  { profile: "bensin_manual", name: "Ban", defaultKmInterval: 12000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Periksa retak dan aus." },
  { profile: "bensin_manual", name: "Aki", defaultKmInterval: 18000, defaultTimeIntervalDays: 540, warningThreshold: 1500, notes: "Cek tegangan bila starter lemah." },
  { profile: "bensin_manual", name: "Filter Udara", defaultKmInterval: 12000, defaultTimeIntervalDays: 180, warningThreshold: 1000, notes: "Ganti bila aliran udara terganggu." },
  { profile: "bensin_manual", name: "Busi", defaultKmInterval: 8000, defaultTimeIntervalDays: 240, warningThreshold: 500, notes: "Gunakan tipe sesuai rekomendasi pabrikan." },
  { profile: "bensin_manual", name: "Kopling", defaultKmInterval: 15000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Cek kampas jika tenaga turun." },
  { profile: "listrik", name: "Brake Pads", defaultKmInterval: 8000, defaultTimeIntervalDays: 180, warningThreshold: 500, notes: "Inspect brake bite and pad wear." },
  { profile: "listrik", name: "Tires", defaultKmInterval: 12000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Check wear pattern and pressure." },
  { profile: "listrik", name: "Battery Health Check", defaultKmInterval: 10000, defaultTimeIntervalDays: 120, warningThreshold: 1000, notes: "Review charging behavior and SOH." },
  { profile: "listrik", name: "Motor / Controller Inspection", defaultKmInterval: 12000, defaultTimeIntervalDays: 180, warningThreshold: 1000, notes: "Inspect noise and cooling path." },
  { profile: "listrik", name: "Suspension Check", defaultKmInterval: 12000, defaultTimeIntervalDays: 240, warningThreshold: 1000, notes: "Check comfort, leaks, and rebound." },
  { profile: "listrik", name: "Bearing Check", defaultKmInterval: 15000, defaultTimeIntervalDays: 365, warningThreshold: 1000, notes: "Inspect wheel bearing smoothness." },
];

export const getMaintenanceProfile = (
  fuelType: FuelType,
  transmission: TransmissionType,
): MaintenanceProfile => {
  if (fuelType === "listrik") {
    return "listrik";
  }

  return transmission === "matic" ? "bensin_matic" : "bensin_manual";
};

export const getTemplateComponents = (
  fuelType: FuelType,
  transmission: TransmissionType,
): ComponentTemplate[] => {
  const profile = getMaintenanceProfile(fuelType, transmission);
  return componentTemplates.filter((template) => template.profile === profile);
};
