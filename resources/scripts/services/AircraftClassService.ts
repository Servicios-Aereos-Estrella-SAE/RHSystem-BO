import type { AircraftClassInterface } from "../interfaces/AircraftClassInterface";

export default class AircraftClassService {
  protected API_PATH: string;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft-classes`, {
      query: {
        searchText,  
        page,
        limit
      },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      }
    });

    if (responseRequest?.data) {
      return {
        data: responseRequest.data.data,
        meta: responseRequest.data.meta
      };
    }

    return responseRequest;
  }

  async delete(aircraftClass: AircraftClassInterface) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft-classes/${aircraftClass.aircraftClassId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }

  async create(aircraftClass: AircraftClassInterface) {
    let responseRequest: any = null;
    const formData = new FormData();
    formData.append('aircraftClassName', aircraftClass.aircraftClassName);
    if (aircraftClass.aircraftClassShortDescription) {
    formData.append('aircraftClassShortDescription', aircraftClass.aircraftClassShortDescription);
    }
    if (aircraftClass.aircraftClassLongDescription) {
    formData.append('aircraftClassLongDescription', aircraftClass.aircraftClassLongDescription);
    }
    if (aircraftClass.aircraftClassBanner) {
        formData.append('aircraftClassBanner', aircraftClass.aircraftClassBanner);
    }
    await $fetch(`${this.API_PATH}/aircraft-classes`, {
        method: 'POST',
        body: formData,
        headers: {
        },
        onResponse({ response }) { responseRequest = response; },
        onRequestError({ response }) { responseRequest = response; }
    });
    return responseRequest;
}

async update(aircraftClass: AircraftClassInterface) {
  let responseRequest: any = null;
  const formData = new FormData();

  formData.append('aircraftClassName', aircraftClass.aircraftClassName);
  if (aircraftClass.aircraftClassShortDescription) {
    formData.append('aircraftClassShortDescription', aircraftClass.aircraftClassShortDescription);
  }
  if (aircraftClass.aircraftClassLongDescription) {
    formData.append('aircraftClassLongDescription', aircraftClass.aircraftClassLongDescription);
  }
  if (aircraftClass.aircraftClassBanner) {
    formData.append('aircraftClassBanner', aircraftClass.aircraftClassBanner);
  }

  await $fetch(`${this.API_PATH}/aircraft-classes/${aircraftClass.aircraftClassId}`, {
    method: 'PUT',
    body: formData,
    headers: {
    },
    onResponse({ response }) { responseRequest = response; },
    onRequestError({ response }) { responseRequest = response; }
  });

  return responseRequest;
}

}
