export type FuelType = "bensin" | "listrik";
export type TransmissionType = "matic" | "manual" | "automatic" | "single_speed";
export type MaintenanceProfile = "bensin_matic" | "bensin_manual" | "listrik";
export type ServiceHealth = "good" | "upcoming" | "overdue";

export interface Profile {
  id: string;
  isAnonymous: boolean;
  displayName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Motorcycle {
  id: string;
  userId: string;
  nickname: string;
  plateNumber: string;
  engineNumber: string;
  chassisNumber: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  brand?: string | null;
  model?: string | null;
  productionYear?: number | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceComponent {
  id: string;
  userId: string;
  motorcycleId: string;
  name: string;
  kmInterval: number;
  timeIntervalDays: number;
  warningThreshold: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceLog {
  id: string;
  userId: string;
  motorcycleId: string;
  serviceDate: string;
  odometer: number;
  serviceType: string;
  workshop: string;
  cost: number;
  notes?: string | null;
  nextReminderDate?: string | null;
  componentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OdometerRecord {
  id: string;
  userId: string;
  motorcycleId: string;
  recordedAt: string;
  odometer: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceStatusSummary {
  componentId: string;
  componentName: string;
  lastServiceDate: string;
  lastServiceOdometer: number;
  nextDueDate: string;
  nextDueOdometer: number;
  currentOdometer: number;
  daysRemaining: number;
  kmRemaining: number;
  status: ServiceHealth;
  warningThreshold: number;
}

export interface DashboardStats {
  totalComponents: number;
  overdueCount: number;
  upcomingCount: number;
  goodCount: number;
  currentOdometer: number;
  projectedMonthlyDistance: number | null;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface MotorcycleFormValues {
  nickname: string;
  plateNumber: string;
  engineNumber: string;
  chassisNumber: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  brand?: string;
  model?: string;
  productionYear?: number;
  photoUrl?: string;
}

export interface ServiceLogFormValues {
  serviceDate: string;
  odometer: number;
  serviceType: string;
  workshop: string;
  cost: number;
  notes?: string;
  nextReminderDate?: string;
  componentIds: string[];
}

export interface OdometerFormValues {
  recordedAt: string;
  odometer: number;
  notes?: string;
}

export interface ComponentTemplate {
  profile: MaintenanceProfile;
  name: string;
  defaultKmInterval: number;
  defaultTimeIntervalDays: number;
  warningThreshold: number;
  notes?: string;
}
