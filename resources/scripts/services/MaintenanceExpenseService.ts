import type { ToastServiceMethods } from "primevue/toastservice";
import type { AircraftMaintenanceInterface } from "../interfaces/AircraftMaintenanceInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { MaintenanceExpenseInterface } from "../interfaces/MaintenanceExpenseInterface";

export default class MaintenanceExpenseService {
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

  async getFilteredList(aircraftMaintenanceId: number, searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/maintenance-expenses`, {
      headers,
      query: {
        searchText,
        page,
        limit,
        aircraftMaintenanceId,
      },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      }
    });

    return responseRequest._data.data.expenses;
  }

  async delete(aircraftMaintenance: MaintenanceExpenseInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/maintenance-expenses/${aircraftMaintenance.maintenanceExpenseId}`, {
      method: 'DELETE',
      headers,
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }

  async store(aircraftMaintenance: MaintenanceExpenseInterface, photo: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in aircraftMaintenance) {
      if (aircraftMaintenance.hasOwnProperty(key)) {
        if (aircraftMaintenance[key] === undefined || aircraftMaintenance[key] === 'null') {
          aircraftMaintenance[key] = ''
        }
        formData.append(key, aircraftMaintenance[key])
      }
    }

    try {
      await $fetch(`${this.API_PATH}/maintenance-expenses`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async update(aircraftMaintenance: MaintenanceExpenseInterface, photo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in aircraftMaintenance) {
      if (aircraftMaintenance.hasOwnProperty(key)) {
        if (aircraftMaintenance[key] === undefined || aircraftMaintenance[key] === 'null') {
          aircraftMaintenance[key] = ''
        }
        formData.append(key, aircraftMaintenance[key])
      }
    }
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/maintenance-expenses/${aircraftMaintenance.maintenanceExpenseId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  validateInformation(aircraftMaintenance: MaintenanceExpenseInterface, toast: ToastServiceMethods) {
    // Validate information
    if (!aircraftMaintenance.aircraftMaintenanceId) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceExpenseCategoryId) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceExpenseAmount) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceExpenseTrackingNumber) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceExpenseInternalFolio) {
      return false;
    }
    // aircraftMaintenance.aircraftMaintenanceStartDate = DateTime.fromISO(aircraftMaintenance.aircraftMaintenanceStartDate as string, { zone: 'utc' }).toString()
    // aircraftMaintenance.aircraftMaintenanceEndDate = DateTime.fromISO(aircraftMaintenance.aircraftMaintenanceEndDate as string, { zone: 'utc' }).toString();

    return true;
  }
}
