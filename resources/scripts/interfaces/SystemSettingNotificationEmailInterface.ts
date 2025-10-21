export interface SystemSettingNotificationEmailInterface {
  systemSettingNotificationEmailId?: number;
  email: string;
  systemSettingId: number;
  deletedAt?: string | null;
  systemSettingNotificationEmailCreatedAt?: string;
  systemSettingNotificationEmailUpdatedAt?: string;
  systemSetting?: {
    systemSettingId: number;
    systemSettingTradeName: string;
    systemSettingLogo: string;
    systemSettingBanner: string;
    systemSettingFavicon: string;
    systemSettingSidebarColor: string;
    systemSettingActive: number;
    systemSettingBusinessUnits: string;
    systemSettingToleranceCountPerAbsence: number;
    systemSettingRestrictFutureVacation: number;
    systemSettingCreatedAt: string;
    systemSettingUpdatedAt: string;
    deletedAt: string | null;
  };
}

export interface SystemSettingNotificationEmailCreateInterface {
  systemSettingId: number;
  email: string;
}

export interface SystemSettingNotificationEmailResponseInterface {
  type: string;
  title: string;
  message: string;
  data: {
    systemSettingNotificationEmails: SystemSettingNotificationEmailInterface[];
  };
}
