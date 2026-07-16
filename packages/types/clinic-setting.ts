export interface WorkingHoursWindow {
  open: string;
  close: string;
  closed?: boolean;
}

export type WorkingHours = Record<string, WorkingHoursWindow>;

export interface ClinicSettingRecord {
  id: string;
  slug: string;
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  workingHours: WorkingHours;
  vapiConfig: Record<string, unknown>;
  notificationSettings: Record<string, unknown>;
  updatedByStaffUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}