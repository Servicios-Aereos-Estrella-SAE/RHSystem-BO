import type { ToastServiceMethods } from "primevue/toastservice";
import type { AircraftMaintenanceInterface } from "../interfaces/AircraftMaintenanceInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AircraftMaintenanceService {
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

  async getFilteredList(aircraftId: number, date: string, searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft-maintenance`, {
      headers,
      query: {
        searchText,
        page,
        limit,
        aircraftId,
        date
      },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      }
    });

    return responseRequest._data.data.aircraftMaintenances;
  }

  async delete(aircraftMaintenance: AircraftMaintenanceInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft-maintenance/${aircraftMaintenance.aircraftMaintenanceId}`, {
      method: 'DELETE',
      headers,
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }

  async store(aircraftMaintenance: AircraftMaintenanceInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/aircraft-maintenance`, {
        headers,
        method: 'POST',
        body: { ...aircraftMaintenance },
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async update(aircraftMaintenance: AircraftMaintenanceInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/aircraft-maintenance/${aircraftMaintenance.aircraftMaintenanceId}`, {
        headers,
        method: 'PUT',
        body: { ...aircraftMaintenance },
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  validateInformation(aircraftMaintenance: AircraftMaintenanceInterface, toast: ToastServiceMethods) {
    // Validate information
    if (!aircraftMaintenance.aircraftId) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceTypeId) {
      return false;
    }
    if (!aircraftMaintenance.aircraftMaintenanceStartDate) {
      return false;
    }
    if (!aircraftMaintenance.aircraftMaintenanceEndDate) {
      return false;
    }
    if (!aircraftMaintenance.maintenanceUrgencyLevelId) {
      return false;
    }
    if (!aircraftMaintenance.aircraftMaintenanceStatusId) {
      return false;
    }
    // validate that start date is before end date
    if (aircraftMaintenance.aircraftMaintenanceStartDate > aircraftMaintenance.aircraftMaintenanceEndDate) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The start date must be before the end date',
        life: 5000
      });
      return false;
    }
    return true;
  }
}
