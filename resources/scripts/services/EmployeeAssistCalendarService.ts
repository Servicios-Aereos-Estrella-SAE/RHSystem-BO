import type { AssistInterface } from "../interfaces/AssistInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeAssistCalendarService {
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

      await $fetch(`${this.API_PATH}/v1/employee-assist-calendars`, {
        headers,
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest
  }
}
