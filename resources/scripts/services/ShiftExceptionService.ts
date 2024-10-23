import type { ShiftExceptionInterface } from "../interfaces/ShiftExceptionInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class ShiftExceptionService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }
  async getByEmployee(employeeId: number, exceptionTypeId: number | null, dateStart: string | null, dateEnd: string | null) {
    const query = { 'exceptionTypeId': exceptionTypeId, 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/shift-exception-employee/${employeeId}`, {
      headers,
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.shiftExceptions : []
    return list
  }

  async store (shiftException: ShiftExceptionInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/shift-exception`, {
        headers,
        method: 'POST',
        body: { ...shiftException },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (shiftException: ShiftExceptionInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/shift-exception/${shiftException.shiftExceptionId}`, {
        headers,
        method: 'PUT',
        body: { ...shiftException },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (shiftException: ShiftExceptionInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/shift-exception/${shiftException.shiftExceptionId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (shiftExceptionId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/shift-exception/${shiftExceptionId}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const shiftException = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          shiftException: shiftException
        }
      }
    }
  }

  validateInfo(shiftException: ShiftExceptionInterface): boolean {
    if (!shiftException.shiftExceptionsDate) {
      console.error('Wrong date');
      return false;
    }
    if (!shiftException.shiftExceptionsDescription) {
      console.error('Wrong description');
      return false;
    }
    if (!shiftException.exceptionTypeId) {
      console.error('Wrong type id');
      return false;
    }
    return true;
  }
}
