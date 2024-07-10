import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AssistService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor () {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()

    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async index (
    date: string | Date,
    dateEnd: string | Date,
    employeeId: number
  ) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    const query = { date, 'date-end': dateEnd, employeeId }

    await $fetch(`${this.API_PATH}/v1/assists`, {
      headers,
      query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async sync () {
    let responseRequest: any = null
    const payload = { date: '2024-05-01', page: 1 }

    await $fetch(`${this.API_PATH}/v1/assists/synchronize`, {
      method: 'POST',
      query: { ...payload },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getExcel (
    date: string | Date,
    dateEnd: string | Date,
    employeeId: number
  ) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    const query = { date, 'date-end': dateEnd, employeeId }

    await $fetch(`${this.API_PATH}/v1/assists/get-excel`, {
      headers,
      query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async syncStatus () {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/v1/assists/status`, {
      method: 'GET',
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
