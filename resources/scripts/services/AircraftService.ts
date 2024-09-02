import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';

export default class AircraftService {
  protected API_PATH: string;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft`, {
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
      await $fetch(`${this.API_PATH}/aircraft/${id}`, {
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
      const aircraft = responseRequest.status === 200 ? responseRequest._data.data : null;

      return {
        status: responseRequest.status,
        _data: {
          data: {
            aircraft: aircraft
          }
        }
      };
    } catch (error) {
    }
  }

  async update(aircraft: AircraftInterface) {
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/aircraft/${aircraft.aircraftId}`, {
        method: 'PUT',
        body: aircraft,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async store(aircraft: AircraftInterface) {
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/aircraft`, {
        method: 'POST',
        body: aircraft,
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
      });
    } catch (error) {
    }
    return responseRequest;
  }

  async delete(aircraft: AircraftInterface) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft/${aircraft.aircraftId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }
}
