import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface';

export default class AirportService {
  protected API_PATH: string;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/airports`, {
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
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports/${id}`, {
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
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports/${airport.airportId}`, {
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
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/airports`, {
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

    await $fetch(`${this.API_PATH}/airports/${airport.airportId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }
}
