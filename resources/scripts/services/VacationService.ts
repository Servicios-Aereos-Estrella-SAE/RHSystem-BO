import type { VacationInterface } from "../interfaces/VacationInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class VacationService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/vacations`, {
      headers,
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
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/vacations/${vacation.vacationSettingId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async create(vacation: VacationInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/vacations`, {
      headers,
      method: 'POST',
      body: vacation,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async update(vacation: VacationInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/vacations/${vacation.vacationSettingId}`, {
      headers,
      method: 'PUT',
      body: vacation,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
