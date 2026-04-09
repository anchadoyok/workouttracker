export type WorkoutExerciseKey = "jumpingJack" | "sitUp" | "pushUp";
export type WorkoutFieldKey = "jj" | "su" | "pu";
export type ConnectionStatus = "config-missing" | "connecting" | "connected" | "syncing" | "offline" | "error";
export type ConfigSource = "none" | "env" | "local";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface WorkoutLogRow {
  id?: number;
  date_key: string;
  hour: number;
  jj: boolean;
  su: boolean;
  pu: boolean;
  created_at?: string;
}

export interface WorkoutSettings {
  jumpingJack: number;
  sitUp: number;
  pushUp: number;
  dailyTargetSessions: number;
}

export interface WorkoutSessionView extends WorkoutLogRow {
  completedCount: number;
  isComplete: boolean;
  isPartial: boolean;
}

export interface ChartDatum {
  label: string;
  value: number;
  meta?: string;
}

export interface InsightItem {
  id: string;
  label: string;
  value: string;
  hint: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  accent: "slateblue" | "mint" | "sunrise";
}

export interface CacheSnapshot {
  logs: WorkoutLogRow[];
  settings: WorkoutSettings;
  updatedAt: string;
}

export interface PendingLogOperation {
  id: string;
  type: "upsert-log";
  payload: WorkoutLogRow;
  createdAt: string;
}

export interface PendingSettingsOperation {
  id: string;
  type: "save-settings";
  payload: WorkoutSettings;
  createdAt: string;
}

export type PendingOperation = PendingLogOperation | PendingSettingsOperation;

export interface DashboardStats {
  totalRepsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}
