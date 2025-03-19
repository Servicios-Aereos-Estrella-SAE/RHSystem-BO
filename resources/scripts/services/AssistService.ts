import type { AssistInterface } from "../interfaces/AssistInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AssistService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()

    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async index(
    date: string | Date,
    dateEnd: string | Date,
    employeeId: number
  ) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }
      const query = { date, 'date-end': dateEnd, employeeId }

      await $fetch(`${this.API_PATH}/v1/assists`, {
        headers,
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest
  }

  async sync() {
    let responseRequest: any = null
    const payload = { date: '2024-05-01', page: 1 }
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/v1/assists/synchronize`, {
      headers,
      method: 'POST',
      query: { ...payload },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async syncEmployee(startDate: string | Date, endDate: string | Date, empCode: string) {
    let responseRequest: any = null
    const payload = { startDate, endDate, empCode, page: 1 }
    const headers = { ...this.GENERAL_HEADERS }
    await $fetch(`${this.API_PATH}/v1/assists/employee-synchronize`, {
      method: 'POST',
      headers,
      query: { ...payload },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async getExcelByEmployee(
    date: string | Date,
    dateEnd: string | Date,
    employeeId: number,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, employeeId, reportType }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-employee`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getExcelByPosition(
    date: string | Date,
    dateEnd: string | Date,
    departmentId: number,
    positionId: number
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, departmentId, positionId }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-position`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getExcelByDepartment(
    date: string | Date,
    dateEnd: string | Date,
    departmentId: number,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, departmentId, reportType }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-department`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }


  async getExcelAll(
    date: string | Date,
    dateEnd: string | Date,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, reportType }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async syncStatus() {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/v1/assists/status`, {
      method: 'GET',
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(assist: AssistInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    try {
      await $fetch(`${this.API_PATH}/v1/assists`, {
        method: 'POST',
        headers,
        body: { ...assist },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
