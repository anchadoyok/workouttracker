import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { ConfigSource, SupabaseConfig } from "@/types/workout";
import { readStoredSupabaseConfig } from "@/services/localCacheService";

let cachedClient: SupabaseClient | null = null;
let cachedKey = "";

export const hasValidSupabaseConfig = (config: SupabaseConfig | null | undefined): config is SupabaseConfig =>
  Boolean(config?.url?.trim() && config?.anonKey?.trim());

export const getEnvSupabaseConfig = (): SupabaseConfig | null => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

export const resolveSupabaseConfig = (): { config: SupabaseConfig | null; source: ConfigSource } => {
  const localConfig = readStoredSupabaseConfig();

  if (hasValidSupabaseConfig(localConfig)) {
    return { config: localConfig, source: "local" };
  }

  const envConfig = getEnvSupabaseConfig();

  if (hasValidSupabaseConfig(envConfig)) {
    return { config: envConfig, source: "env" };
  }

  return { config: null, source: "none" };
};

export const createSupabaseBrowserClient = (config: SupabaseConfig) => {
  const cacheKey = `${config.url}::${config.anonKey}`;

  if (cachedClient && cachedKey === cacheKey) {
    return cachedClient;
  }

  cachedKey = cacheKey;
  cachedClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
};
