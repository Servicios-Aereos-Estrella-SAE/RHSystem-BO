import type { ToastServiceMethods } from "primevue/toastservice";
import type { AircraftMaintenanceInterface } from "../interfaces/AircraftMaintenanceInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { MaintenanceExpenseInterface } from "../interfaces/MaintenanceExpenseInterface";

export default class MaintenanceExpenseCategoryService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig();
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/maintenance-expense-categories`, {
      headers,
      query: {
        searchText,
        page,
        limit,
      },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      }
    });

    return responseRequest._data.data.categories;
  }
}
