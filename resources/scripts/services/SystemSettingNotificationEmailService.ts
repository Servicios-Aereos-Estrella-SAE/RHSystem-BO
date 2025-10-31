import type {
  SystemSettingNotificationEmailInterface,
  SystemSettingNotificationEmailCreateInterface,
  SystemSettingNotificationEmailResponseInterface
} from "~/resources/scripts/interfaces/SystemSettingNotificationEmailInterface";
import type { GeneralHeadersInterface } from "~/resources/scripts/interfaces/GeneralHeadersInterface";

export default class SystemSettingNotificationEmailService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface;

  constructor() {
    const CONFIG = useRuntimeConfig();
    const { token } = useAuth();

    this.API_PATH = CONFIG.public.BASE_API_PATH;
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    };
  }

  /**
   * Obtiene todos los emails de notificación de un system setting
   */
  async getNotificationEmails(systemSettingId: number): Promise<SystemSettingNotificationEmailResponseInterface | null> {
    const headers = { ...this.GENERAL_HEADERS };
    let responseRequest: any = null;

    try {
      await $fetch(`${this.API_PATH}/system-settings-notification-emails/${systemSettingId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      });

      if (responseRequest && responseRequest.status === 200) {
        return responseRequest._data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching notification emails:', error);
      return null;
    }
  }

  /**
   * Agrega un nuevo email de notificación
   */
  async createNotificationEmail(data: SystemSettingNotificationEmailCreateInterface): Promise<any> {
    const headers = { ...this.GENERAL_HEADERS };
    let responseRequest: any = null;

    try {
      await $fetch(`${this.API_PATH}/system-settings-notification-emails`, {
        headers,
        method: 'POST',
        body: data,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      });

      return responseRequest;
    } catch (error) {
      console.error('Error creating notification email:', error);
      return null;
    }
  }

  /**
   * Elimina un email de notificación
   */
  async deleteNotificationEmail(systemSettingNotificationEmailId: number): Promise<any> {
    const headers = { ...this.GENERAL_HEADERS };
    let responseRequest: any = null;

    try {
      await $fetch(`${this.API_PATH}/system-settings-notification-emails/${systemSettingNotificationEmailId}`, {
        headers,
        method: 'DELETE',
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      });

      return responseRequest;
    } catch (error) {
      console.error('Error deleting notification email:', error);
      return null;
    }
  }

  /**
   * Valida si un email es válido
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
