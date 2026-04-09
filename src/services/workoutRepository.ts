import type { SupabaseClient } from "@supabase/supabase-js";

import { SETTINGS_ROW_KEY } from "@/constants/workout";
import type { WorkoutLogRow, WorkoutSettings } from "@/types/workout";

export const fetchWorkoutBootstrap = async (client: SupabaseClient) => {
  const [logsResult, settingsResult] = await Promise.all([
    client.from("workout_logs").select("id, date_key, hour, jj, su, pu, created_at").order("date_key").order("hour"),
    client.from("workout_settings").select("value").eq("key", SETTINGS_ROW_KEY).maybeSingle(),
  ]);

  if (logsResult.error) {
    throw logsResult.error;
  }

  if (settingsResult.error && settingsResult.error.code !== "PGRST116") {
    throw settingsResult.error;
  }

  return {
    logs: (logsResult.data ?? []) as WorkoutLogRow[],
    settings: (settingsResult.data?.value ?? null) as Partial<WorkoutSettings> | null,
  };
};

export const upsertWorkoutLogRecord = async (client: SupabaseClient, log: WorkoutLogRow) => {
  const { error } = await client.from("workout_logs").upsert(
    {
      date_key: log.date_key,
      hour: log.hour,
      jj: log.jj,
      su: log.su,
      pu: log.pu,
    },
    {
      onConflict: "date_key,hour",
    },
  );

  if (error) {
    throw error;
  }
};

export const saveWorkoutSettingsRecord = async (client: SupabaseClient, settings: WorkoutSettings) => {
  const { error } = await client.from("workout_settings").upsert(
    {
      key: SETTINGS_ROW_KEY,
      value: settings,
    },
    {
      onConflict: "key",
    },
  );

  if (error) {
    throw error;
  }
};
