
import type { EmployeeShiftInterface } from "../interfaces/EmployeeShiftInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeShiftService {
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
  async getByEmployee(employeeId: number, shiftId: number | null, dateStart: string | null, dateEnd: string | null) {
    const query = { 'shiftId': shiftId, 'dateStart': dateStart, 'dateEnd': dateEnd }
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-shifts-employee/${employeeId}`, {
      headers,
      query: query,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async getShiftActiveByEmployee(employeeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-shifts-active-shift-employee/${employeeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const employeeShift = responseRequest.status === 200 ? responseRequest._data.data : null
    return employeeShift
  }


  async store(employeeShift: EmployeeShiftInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee_shifts`, {
        headers,
        method: 'POST',
        body: { ...employeeShift },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeShift: EmployeeShiftInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee_shifts/${employeeShift.employeeShiftId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeShift },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeShift: EmployeeShiftInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee_shifts/${employeeShift.employeeShiftId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeShiftId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee_shifts/${employeeShiftId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeShift = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeShift: employeeShift
        }
      }
    }
  }

  validateInfo(employeeShift: EmployeeShiftInterface): boolean {
    if (!employeeShift.employeShiftsApplySince) {
      console.error('Wrong date');
      return false;
    }
    if (!employeeShift.shiftId) {
      console.error('Wrong shift id');
      return false;
    }
    return true;
  }
}
