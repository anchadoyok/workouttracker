import { demoSeed } from "@/lib/demoData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateId } from "@/lib/utils";
import { getTemplateComponents } from "@/constants/componentTemplates";
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

interface AppDataSnapshot {
  profile: Profile;
  motorcycles: Motorcycle[];
  serviceComponents: ServiceComponent[];
  serviceLogs: ServiceLog[];
  odometerRecords: OdometerRecord[];
}

interface Repository {
  ensureSession(): Promise<Profile>;
  getSnapshot(userId: string): Promise<AppDataSnapshot>;
  createMotorcycle(userId: string, values: MotorcycleFormValues): Promise<Motorcycle>;
  updateMotorcycle(id: string, values: MotorcycleFormValues): Promise<Motorcycle>;
  deleteMotorcycle(id: string): Promise<void>;
  updateServiceComponent(component: ServiceComponent): Promise<ServiceComponent>;
  createServiceLog(userId: string, motorcycleId: string, values: ServiceLogFormValues): Promise<ServiceLog>;
  updateServiceLog(id: string, values: ServiceLogFormValues): Promise<ServiceLog>;
  deleteServiceLog(id: string): Promise<void>;
  createOdometerRecord(userId: string, motorcycleId: string, values: OdometerFormValues): Promise<OdometerRecord>;
  updateOdometerRecord(id: string, values: OdometerFormValues): Promise<OdometerRecord>;
  deleteOdometerRecord(id: string): Promise<void>;
}

const storageKey = "motorcycle-tracker-demo-db";

const loadDemoSnapshot = (): AppDataSnapshot => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    localStorage.setItem(storageKey, JSON.stringify(demoSeed));
    return structuredClone(demoSeed);
  }

  return JSON.parse(raw) as AppDataSnapshot;
};

const saveDemoSnapshot = (snapshot: AppDataSnapshot) => {
  localStorage.setItem(storageKey, JSON.stringify(snapshot));
};

const toCamelMotorcycle = (row: Record<string, unknown>): Motorcycle => ({
  id: String(row.id),
  userId: String(row.user_id),
  nickname: String(row.nickname),
  plateNumber: String(row.plate_number),
  engineNumber: String(row.engine_number),
  chassisNumber: String(row.chassis_number),
  fuelType: row.fuel_type as Motorcycle["fuelType"],
  transmission: row.transmission as Motorcycle["transmission"],
  brand: (row.brand as string | null) ?? null,
  model: (row.model as string | null) ?? null,
  productionYear: (row.production_year as number | null) ?? null,
  photoUrl: (row.photo_url as string | null) ?? null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toCamelComponent = (row: Record<string, unknown>): ServiceComponent => ({
  id: String(row.id),
  userId: String(row.user_id),
  motorcycleId: String(row.motorcycle_id),
  name: String(row.name),
  kmInterval: Number(row.km_interval),
  timeIntervalDays: Number(row.time_interval_days),
  warningThreshold: Number(row.warning_threshold),
  notes: (row.notes as string | null) ?? null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toCamelServiceLog = (
  row: Record<string, unknown>,
  componentIds: string[],
): ServiceLog => ({
  id: String(row.id),
  userId: String(row.user_id),
  motorcycleId: String(row.motorcycle_id),
  serviceDate: String(row.service_date),
  odometer: Number(row.odometer),
  serviceType: String(row.service_type),
  workshop: String(row.workshop),
  cost: Number(row.cost),
  notes: (row.notes as string | null) ?? null,
  nextReminderDate: (row.next_reminder_date as string | null) ?? null,
  componentIds,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toCamelOdometer = (row: Record<string, unknown>): OdometerRecord => ({
  id: String(row.id),
  userId: String(row.user_id),
  motorcycleId: String(row.motorcycle_id),
  recordedAt: String(row.recorded_at),
  odometer: Number(row.odometer),
  notes: (row.notes as string | null) ?? null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const demoRepository: Repository = {
  async ensureSession() {
    const snapshot = loadDemoSnapshot();
    return snapshot.profile;
  },
  async getSnapshot() {
    return loadDemoSnapshot();
  },
  async createMotorcycle(userId, values) {
    const snapshot = loadDemoSnapshot();
    const now = new Date().toISOString();
    const motorcycle: Motorcycle = {
      id: generateId(),
      userId,
      nickname: values.nickname,
      plateNumber: values.plateNumber,
      engineNumber: values.engineNumber,
      chassisNumber: values.chassisNumber,
      fuelType: values.fuelType,
      transmission: values.transmission,
      brand: values.brand || null,
      model: values.model || null,
      productionYear: values.productionYear || null,
      photoUrl: values.photoUrl || null,
      createdAt: now,
      updatedAt: now,
    };
    snapshot.motorcycles.unshift(motorcycle);
    const components = getTemplateComponents(values.fuelType, values.transmission).map((template) => ({
      id: generateId(),
      userId,
      motorcycleId: motorcycle.id,
      name: template.name,
      kmInterval: template.defaultKmInterval,
      timeIntervalDays: template.defaultTimeIntervalDays,
      warningThreshold: template.warningThreshold,
      notes: template.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }));
    snapshot.serviceComponents.push(...components);
    saveDemoSnapshot(snapshot);
    return motorcycle;
  },
  async updateMotorcycle(id, values) {
    const snapshot = loadDemoSnapshot();
    const target = snapshot.motorcycles.find((motorcycle) => motorcycle.id === id);
    if (!target) {
      throw new Error("Motorcycle not found");
    }
    Object.assign(target, {
      nickname: values.nickname,
      plateNumber: values.plateNumber,
      engineNumber: values.engineNumber,
      chassisNumber: values.chassisNumber,
      fuelType: values.fuelType,
      transmission: values.transmission,
      brand: values.brand || null,
      model: values.model || null,
      productionYear: values.productionYear || null,
      photoUrl: values.photoUrl || null,
      updatedAt: new Date().toISOString(),
    });
    saveDemoSnapshot(snapshot);
    return target;
  },
  async deleteMotorcycle(id) {
    const snapshot = loadDemoSnapshot();
    snapshot.motorcycles = snapshot.motorcycles.filter((motorcycle) => motorcycle.id !== id);
    snapshot.serviceComponents = snapshot.serviceComponents.filter((component) => component.motorcycleId !== id);
    snapshot.serviceLogs = snapshot.serviceLogs.filter((log) => log.motorcycleId !== id);
    snapshot.odometerRecords = snapshot.odometerRecords.filter((record) => record.motorcycleId !== id);
    saveDemoSnapshot(snapshot);
  },
  async updateServiceComponent(component) {
    const snapshot = loadDemoSnapshot();
    const target = snapshot.serviceComponents.find((item) => item.id === component.id);
    if (!target) {
      throw new Error("Component not found");
    }
    Object.assign(target, { ...component, updatedAt: new Date().toISOString() });
    saveDemoSnapshot(snapshot);
    return target;
  },
  async createServiceLog(userId, motorcycleId, values) {
    const snapshot = loadDemoSnapshot();
    const now = new Date().toISOString();
    const entry: ServiceLog = {
      id: generateId(),
      userId,
      motorcycleId,
      serviceDate: values.serviceDate,
      odometer: values.odometer,
      serviceType: values.serviceType,
      workshop: values.workshop,
      cost: values.cost,
      notes: values.notes || null,
      nextReminderDate: values.nextReminderDate || null,
      componentIds: values.componentIds,
      createdAt: now,
      updatedAt: now,
    };
    snapshot.serviceLogs.unshift(entry);
    saveDemoSnapshot(snapshot);
    return entry;
  },
  async updateServiceLog(id, values) {
    const snapshot = loadDemoSnapshot();
    const target = snapshot.serviceLogs.find((log) => log.id === id);
    if (!target) {
      throw new Error("Service log not found");
    }
    Object.assign(target, {
      serviceDate: values.serviceDate,
      odometer: values.odometer,
      serviceType: values.serviceType,
      workshop: values.workshop,
      cost: values.cost,
      notes: values.notes || null,
      nextReminderDate: values.nextReminderDate || null,
      componentIds: values.componentIds,
      updatedAt: new Date().toISOString(),
    });
    saveDemoSnapshot(snapshot);
    return target;
  },
  async deleteServiceLog(id) {
    const snapshot = loadDemoSnapshot();
    snapshot.serviceLogs = snapshot.serviceLogs.filter((log) => log.id !== id);
    saveDemoSnapshot(snapshot);
  },
  async createOdometerRecord(userId, motorcycleId, values) {
    const snapshot = loadDemoSnapshot();
    const now = new Date().toISOString();
    const record: OdometerRecord = {
      id: generateId(),
      userId,
      motorcycleId,
      recordedAt: values.recordedAt,
      odometer: values.odometer,
      notes: values.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    snapshot.odometerRecords.unshift(record);
    saveDemoSnapshot(snapshot);
    return record;
  },
  async updateOdometerRecord(id, values) {
    const snapshot = loadDemoSnapshot();
    const target = snapshot.odometerRecords.find((record) => record.id === id);
    if (!target) {
      throw new Error("Odometer record not found");
    }
    Object.assign(target, {
      recordedAt: values.recordedAt,
      odometer: values.odometer,
      notes: values.notes || null,
      updatedAt: new Date().toISOString(),
    });
    saveDemoSnapshot(snapshot);
    return target;
  },
  async deleteOdometerRecord(id) {
    const snapshot = loadDemoSnapshot();
    snapshot.odometerRecords = snapshot.odometerRecords.filter((record) => record.id !== id);
    saveDemoSnapshot(snapshot);
  },
};

const supabaseRepository: Repository = {
  async ensureSession() {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const existingSession = sessionData.session;

    const session =
      existingSession ??
      (
        await supabase.auth.signInAnonymously({
          options: {
            data: {
              display_name: "Anonymous rider",
            },
          },
        })
      ).data.session;

    if (!session?.user) {
      throw new Error("Unable to create anonymous session");
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (error) {
      throw error;
    }

    return {
      id: data.id,
      isAnonymous: data.is_anonymous,
      displayName: data.display_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
  async getSnapshot(userId) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const [profilesResult, motorcyclesResult, componentsResult, logsResult, linksResult, odometerResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("motorcycles").select("*").order("created_at", { ascending: false }),
      supabase.from("service_components").select("*"),
      supabase.from("service_logs").select("*").order("service_date", { ascending: false }),
      supabase.from("service_log_components").select("*"),
      supabase.from("odometer_records").select("*").order("recorded_at", { ascending: false }),
    ]);

    for (const result of [profilesResult, motorcyclesResult, componentsResult, logsResult, linksResult, odometerResult]) {
      if (result.error) {
        throw result.error;
      }
    }

    const linkMap = new Map<string, string[]>();
    const links = linksResult.data ?? [];
    const motorcycles = motorcyclesResult.data ?? [];
    const components = componentsResult.data ?? [];
    const logs = logsResult.data ?? [];
    const odometer = odometerResult.data ?? [];

    links.forEach((link) => {
      const current = linkMap.get(link.service_log_id) ?? [];
      current.push(link.service_component_id);
      linkMap.set(link.service_log_id, current);
    });

    return {
      profile: {
        id: profilesResult.data.id,
        isAnonymous: profilesResult.data.is_anonymous,
        displayName: profilesResult.data.display_name,
        createdAt: profilesResult.data.created_at,
        updatedAt: profilesResult.data.updated_at,
      },
      motorcycles: motorcycles.map(toCamelMotorcycle),
      serviceComponents: components.map(toCamelComponent),
      serviceLogs: logs.map((row) => toCamelServiceLog(row, linkMap.get(row.id) ?? [])),
      odometerRecords: odometer.map(toCamelOdometer),
    };
  },
  async createMotorcycle(userId, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const payload = {
      user_id: userId,
      nickname: values.nickname,
      plate_number: values.plateNumber,
      engine_number: values.engineNumber,
      chassis_number: values.chassisNumber,
      fuel_type: values.fuelType,
      transmission: values.transmission,
      brand: values.brand || null,
      model: values.model || null,
      production_year: values.productionYear || null,
      photo_url: values.photoUrl || null,
    };

    const { data, error } = await supabase.from("motorcycles").insert(payload).select("*").single();
    if (error) {
      throw error;
    }

    return toCamelMotorcycle(data);
  },
  async updateMotorcycle(id, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { data, error } = await supabase
      .from("motorcycles")
      .update({
        nickname: values.nickname,
        plate_number: values.plateNumber,
        engine_number: values.engineNumber,
        chassis_number: values.chassisNumber,
        fuel_type: values.fuelType,
        transmission: values.transmission,
        brand: values.brand || null,
        model: values.model || null,
        production_year: values.productionYear || null,
        photo_url: values.photoUrl || null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return toCamelMotorcycle(data);
  },
  async deleteMotorcycle(id) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { error } = await supabase.from("motorcycles").delete().eq("id", id);
    if (error) {
      throw error;
    }
  },
  async updateServiceComponent(component) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { data, error } = await supabase
      .from("service_components")
      .update({
        name: component.name,
        km_interval: component.kmInterval,
        time_interval_days: component.timeIntervalDays,
        warning_threshold: component.warningThreshold,
        notes: component.notes || null,
      })
      .eq("id", component.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return toCamelComponent(data);
  },
  async createServiceLog(userId, motorcycleId, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { data, error } = await supabase
      .from("service_logs")
      .insert({
        user_id: userId,
        motorcycle_id: motorcycleId,
        service_date: values.serviceDate,
        odometer: values.odometer,
        service_type: values.serviceType,
        workshop: values.workshop,
        cost: values.cost,
        notes: values.notes || null,
        next_reminder_date: values.nextReminderDate || null,
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }

    if (values.componentIds.length > 0) {
      const { error: linkError } = await supabase.from("service_log_components").insert(
        values.componentIds.map((componentId) => ({
          user_id: userId,
          service_log_id: data.id,
          service_component_id: componentId,
        })),
      );
      if (linkError) {
        throw linkError;
      }
    }

    return toCamelServiceLog(data, values.componentIds);
  },
  async updateServiceLog(id, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { data: existing, error: fetchError } = await supabase
      .from("service_logs")
      .select("user_id")
      .eq("id", id)
      .single();
    if (fetchError) {
      throw fetchError;
    }

    const { data, error } = await supabase
      .from("service_logs")
      .update({
        service_date: values.serviceDate,
        odometer: values.odometer,
        service_type: values.serviceType,
        workshop: values.workshop,
        cost: values.cost,
        notes: values.notes || null,
        next_reminder_date: values.nextReminderDate || null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw error;
    }

    await supabase.from("service_log_components").delete().eq("service_log_id", id);

    if (values.componentIds.length > 0) {
      const { error: linkError } = await supabase.from("service_log_components").insert(
        values.componentIds.map((componentId) => ({
          user_id: existing.user_id,
          service_log_id: id,
          service_component_id: componentId,
        })),
      );
      if (linkError) {
        throw linkError;
      }
    }

    return toCamelServiceLog(data, values.componentIds);
  },
  async deleteServiceLog(id) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const { error } = await supabase.from("service_logs").delete().eq("id", id);
    if (error) {
      throw error;
    }
  },
  async createOdometerRecord(userId, motorcycleId, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }
    const { data, error } = await supabase
      .from("odometer_records")
      .insert({
        user_id: userId,
        motorcycle_id: motorcycleId,
        recorded_at: values.recordedAt,
        odometer: values.odometer,
        notes: values.notes || null,
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return toCamelOdometer(data);
  },
  async updateOdometerRecord(id, values) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }
    const { data, error } = await supabase
      .from("odometer_records")
      .update({
        recorded_at: values.recordedAt,
        odometer: values.odometer,
        notes: values.notes || null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return toCamelOdometer(data);
  },
  async deleteOdometerRecord(id) {
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }
    const { error } = await supabase.from("odometer_records").delete().eq("id", id);
    if (error) {
      throw error;
    }
  },
};

export const repository: Repository = isSupabaseConfigured ? supabaseRepository : demoRepository;
