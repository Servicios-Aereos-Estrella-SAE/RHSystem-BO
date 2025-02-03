import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AircraftService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft`, {
      headers,
      query: {
        searchText: searchText,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }

  async show(id: number, dateReservation: string | null = null) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/aircraft/${id}`, {
        headers,
        query: {
          date: dateReservation
        },
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
      const aircraft = responseRequest.status === 200 ? responseRequest._data.data.data : null;

      return {
        status: responseRequest.status,
        _data: {
          data: {
            aircraft: aircraft
          }
        }
      };
    } catch (error) {
      return {
        status: responseRequest.status,
        _data: {
          data: {
            aircraft: null
          }
        }
      };
    }
  }

  async update(aircraft: AircraftInterface, pilotPicId: number | null = null, pilotSicId: number | null = null) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/aircraft/${aircraft.aircraftId}`, {
        headers,
        method: 'PUT',
        body: {...aircraft, pilotSicId, pilotPicId},
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async store(aircraft: AircraftInterface, pilotPicId: number | null = null, pilotSicId: number | null = null) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/aircraft`, {
        headers,
        method: 'POST',
        body: {...aircraft, pilotSicId, pilotPicId},
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async delete(aircraft: AircraftInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft/${aircraft.aircraftId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }
}
