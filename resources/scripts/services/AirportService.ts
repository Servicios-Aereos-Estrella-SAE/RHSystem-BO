import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface';
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AirportService {
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

    await $fetch(`${this.API_PATH}/airports`, {
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

  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports/${id}`, {
        headers,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
      const airport = responseRequest.status === 200 ? responseRequest._data.data : null;

      return {
        status: responseRequest.status,
        _data: {
          data: {
            airport: airport
          }
        }
      };
    } catch (error) {
      // Handle error if necessary
    }
  }

  async update(airport: AirportInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports/${airport.airportId}`, {
        headers,
        method: 'PUT',
        body: airport,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
      // Handle error if necessary
    }
    return responseRequest;
  }

  async store(airport: AirportInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports`, {
        headers,
        method: 'POST',
        body: airport,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
      // Handle error if necessary
    }
    return responseRequest;
  }

  async delete(airport: AirportInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/airports/${airport.airportId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }
}
