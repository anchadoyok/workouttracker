import { create } from "zustand";
import { persist } from "zustand/middleware";

import { repository } from "@/services/repository";
import type {
  Motorcycle,
  MotorcycleFormValues,
  OdometerFormValues,
  OdometerRecord,
  Profile,
  ServiceComponent,
  ServiceLog,
  ServiceLogFormValues,
} from "@/types/domain";

interface AppStoreState {
  profile: Profile | null;
  motorcycles: Motorcycle[];
  serviceComponents: ServiceComponent[];
  serviceLogs: ServiceLog[];
  odometerRecords: OdometerRecord[];
  selectedMotorcycleId: string | null;
  isBootstrapping: boolean;
  isSaving: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  selectMotorcycle: (id: string) => void;
  createMotorcycle: (values: MotorcycleFormValues) => Promise<Motorcycle>;
  updateMotorcycle: (id: string, values: MotorcycleFormValues) => Promise<Motorcycle>;
  deleteMotorcycle: (id: string) => Promise<void>;
  updateServiceComponent: (component: ServiceComponent) => Promise<ServiceComponent>;
  createServiceLog: (values: ServiceLogFormValues) => Promise<ServiceLog>;
  updateServiceLog: (id: string, values: ServiceLogFormValues) => Promise<ServiceLog>;
  deleteServiceLog: (id: string) => Promise<void>;
  createOdometerRecord: (values: OdometerFormValues) => Promise<OdometerRecord>;
  updateOdometerRecord: (id: string, values: OdometerFormValues) => Promise<OdometerRecord>;
  deleteOdometerRecord: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const withSaving = async <T>(
  set: (updater: Partial<AppStoreState>) => void,
  callback: () => Promise<T>,
) => {
  set({ isSaving: true, error: null });
  try {
    return await callback();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    set({ error: message });
    throw error;
  } finally {
    set({ isSaving: false });
  }
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      profile: null,
      motorcycles: [],
      serviceComponents: [],
      serviceLogs: [],
      odometerRecords: [],
      selectedMotorcycleId: null,
      isBootstrapping: true,
      isSaving: false,
      error: null,
      async initialize() {
        set({ isBootstrapping: true, error: null });
        try {
          const profile = await repository.ensureSession();
          const snapshot = await repository.getSnapshot(profile.id);
          const currentSelectedId = get().selectedMotorcycleId;
          const fallbackSelectedId =
            snapshot.motorcycles.find((motorcycle) => motorcycle.id === currentSelectedId)?.id ??
            snapshot.motorcycles[0]?.id ??
            null;

          set({
            profile,
            motorcycles: snapshot.motorcycles,
            serviceComponents: snapshot.serviceComponents,
            serviceLogs: snapshot.serviceLogs,
            odometerRecords: snapshot.odometerRecords,
            selectedMotorcycleId: fallbackSelectedId,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to load data";
          set({ error: message });
        } finally {
          set({ isBootstrapping: false });
        }
      },
      selectMotorcycle(id) {
        set({ selectedMotorcycleId: id });
      },
      async refreshData() {
        const profile = get().profile;
        if (!profile) {
          return;
        }
        const snapshot = await repository.getSnapshot(profile.id);
        set({
          motorcycles: snapshot.motorcycles,
          serviceComponents: snapshot.serviceComponents,
          serviceLogs: snapshot.serviceLogs,
          odometerRecords: snapshot.odometerRecords,
          selectedMotorcycleId:
            snapshot.motorcycles.find((motorcycle) => motorcycle.id === get().selectedMotorcycleId)?.id ??
            snapshot.motorcycles[0]?.id ??
            null,
        });
      },
      async createMotorcycle(values) {
        const profile = get().profile;
        if (!profile) {
          throw new Error("Profile not loaded");
        }
        return withSaving(set, async () => {
          const motorcycle = await repository.createMotorcycle(profile.id, values);
          await get().refreshData();
          set({ selectedMotorcycleId: motorcycle.id });
          return motorcycle;
        });
      },
      async updateMotorcycle(id, values) {
        return withSaving(set, async () => {
          const updated = await repository.updateMotorcycle(id, values);
          await get().refreshData();
          return updated;
        });
      },
      async deleteMotorcycle(id) {
        await withSaving(set, async () => {
          await repository.deleteMotorcycle(id);
          await get().refreshData();
        });
      },
      async updateServiceComponent(component) {
        return withSaving(set, async () => {
          const updated = await repository.updateServiceComponent(component);
          await get().refreshData();
          return updated;
        });
      },
      async createServiceLog(values) {
        const profile = get().profile;
        const motorcycleId = get().selectedMotorcycleId;
        if (!profile || !motorcycleId) {
          throw new Error("Select a motorcycle first");
        }
        return withSaving(set, async () => {
          const created = await repository.createServiceLog(profile.id, motorcycleId, values);
          await get().refreshData();
          return created;
        });
      },
      async updateServiceLog(id, values) {
        return withSaving(set, async () => {
          const updated = await repository.updateServiceLog(id, values);
          await get().refreshData();
          return updated;
        });
      },
      async deleteServiceLog(id) {
        await withSaving(set, async () => {
          await repository.deleteServiceLog(id);
          await get().refreshData();
        });
      },
      async createOdometerRecord(values) {
        const profile = get().profile;
        const motorcycleId = get().selectedMotorcycleId;
        if (!profile || !motorcycleId) {
          throw new Error("Select a motorcycle first");
        }
        return withSaving(set, async () => {
          const created = await repository.createOdometerRecord(profile.id, motorcycleId, values);
          await get().refreshData();
          return created;
        });
      },
      async updateOdometerRecord(id, values) {
        return withSaving(set, async () => {
          const updated = await repository.updateOdometerRecord(id, values);
          await get().refreshData();
          return updated;
        });
      },
      async deleteOdometerRecord(id) {
        await withSaving(set, async () => {
          await repository.deleteOdometerRecord(id);
          await get().refreshData();
        });
      },
    }),
    {
      name: "motorcycle-tracker-ui-store",
      partialize: (state) => ({
        selectedMotorcycleId: state.selectedMotorcycleId,
      }),
    },
  ),
);
