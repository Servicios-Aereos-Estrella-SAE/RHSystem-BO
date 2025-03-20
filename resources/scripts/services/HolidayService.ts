import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class HolidayService {
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

  async getFilteredList(searchText: string, firstDate: string | null, lastDate: string | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/holidays`, {
      headers,
      query: {
        search: searchText,
        firstDate,
        lastDate,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(id: number) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }

      await $fetch(`${this.API_PATH}/holidays/${id}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const holiday = responseRequest.status === 200 ? responseRequest._data.data : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            holiday: holiday
          }
        }
      }
    } catch (error) {
    }
  }

  async update(holiday: HolidayInterface, iconId: number = 0) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }
      await $fetch(`${this.API_PATH}/holidays/${holiday.holidayId}`, {
        headers,
        method: 'PUT',
        body: { ...holiday },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async store(holiday: HolidayInterface, iconId: number = 0) {
    let responseRequest: any = null

    try {
      const headers = { ...this.GENERAL_HEADERS }
      await $fetch(`${this.API_PATH}/holidays`, {
        headers,
        method: 'POST',
        body: { ...holiday },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getIconList() {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/icons`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async delete(holiday: HolidayInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/holidays/${holiday.holidayId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}