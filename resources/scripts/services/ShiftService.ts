import type { ShiftInterface } from "../interfaces/ShiftInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class ShiftService {
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

    await $fetch(`${this.API_PATH}/shift`, {
      headers,
      query: {
        shiftName: searchText,
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

  async delete(shift: ShiftInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/shift/${shift.shiftId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    });

    return responseRequest;
  }

  async create(shift: ShiftInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/shift`, {
        headers,
        method: 'POST',
        body: shift,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(shift: ShiftInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/shift/${shift.shiftId}`, {
        headers,
        method: 'PUT',
        body: shift,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
