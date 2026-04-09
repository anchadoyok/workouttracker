import { STORAGE_KEYS } from "@/constants/workout";
import type { CacheSnapshot, PendingOperation, SupabaseConfig, WorkoutLogRow } from "@/types/workout";

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readJson = <T>(key: string, fallback: T) => {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const buildPendingId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const readStoredSupabaseConfig = () => readJson<SupabaseConfig | null>(STORAGE_KEYS.config, null);

export const saveStoredSupabaseConfig = (config: SupabaseConfig) => {
  writeJson(STORAGE_KEYS.config, {
    url: config.url.trim(),
    anonKey: config.anonKey.trim(),
  });
};

export const clearStoredSupabaseConfig = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.config);
};

export const readCacheSnapshot = () => readJson<CacheSnapshot | null>(STORAGE_KEYS.snapshot, null);

export const writeCacheSnapshot = (snapshot: CacheSnapshot) => {
  writeJson(STORAGE_KEYS.snapshot, snapshot);
};

export const readPendingOperations = () => readJson<PendingOperation[]>(STORAGE_KEYS.queue, []);

export const writePendingOperations = (operations: PendingOperation[]) => {
  writeJson(STORAGE_KEYS.queue, operations);
};

export const mergePendingOperations = (existing: PendingOperation[], operation: PendingOperation) => {
  const filtered = existing.filter((item) => {
    if (operation.type === "save-settings") {
      return item.type !== "save-settings";
    }

    if (item.type !== "upsert-log") {
      return true;
    }

    const nextLog = operation.payload as WorkoutLogRow;

    return !(item.payload.date_key === nextLog.date_key && item.payload.hour === nextLog.hour);
  });

  return [...filtered, operation];
};
