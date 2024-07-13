import type { PositionInterface } from "../interfaces/PositionInterface"

export default class ShiftExceptionService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByEmployee(employeeId: number, exceptionTypeId: number | null, dateStart: string | null, dateEnd: string | null) {
    const query = { 'exceptionTypeId': exceptionTypeId, 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/shift-exception-employee/${employeeId}`, {
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.shiftExceptions : []
    return list
  }
}
