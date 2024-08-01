import type { VacationInterface } from "../interfaces/VacationInterface"

export default class VacationService {
  protected API_PATH: string

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/vacations`, {
      query: {
        searchText,  // Cambia esto según el nombre del parámetro que uses en tu API
        page,
        limit
      },
      onResponse({ response }) {
        responseRequest = response
      },
      onRequestError({ response }) {
        responseRequest = response
      }
    })

    if (responseRequest?.data) {
      return {
        data: responseRequest.data.data,
        meta: responseRequest.data.meta
      }
    }

    return responseRequest
  }

  async delete(vacation: VacationInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/vacations/${vacation.vacationSettingId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async create(vacation: VacationInterface) {
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/vacations`, {
      method: 'POST',
      body: vacation,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async update(vacation: VacationInterface) {
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/vacations/${vacation.vacationSettingId}`, {
      method: 'PUT',
      body: vacation,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
