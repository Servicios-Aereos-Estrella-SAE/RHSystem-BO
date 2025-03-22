import type { EmployeeShiftChangeInterface } from "../interfaces/EmployeeShiftChangeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeShiftChangeService {
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


  async store(employeeShiftChange: EmployeeShiftChangeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-shift-changes`, {
        headers,
        method: 'POST',
        body: { ...employeeShiftChange },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeShiftChange: EmployeeShiftChangeInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-shift-changes/${employeeShiftChange.employeeShiftChangeId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeShiftChangeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-shift-changes/${employeeShiftChangeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeShiftChange = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeShiftChange: employeeShiftChange
        }
      }
    }
  }

  validateInfo(employeeShiftChange: EmployeeShiftChangeInterface): boolean {
    if (!employeeShiftChange.employeeIdFrom) {
      console.error('Wrong employee id from');
      return false;
    }
    if (!employeeShiftChange.shiftIdFrom) {
      console.error('Wrong shift id from');
      return false;
    }
    if (!employeeShiftChange.employeeShiftChangeDateFrom) {
      console.error('Wrong date from');
      return false;
    }
    if (!employeeShiftChange.employeeIdTo) {
      console.error('Wrong employee id to');
      return false;
    }
    if (!employeeShiftChange.shiftIdTo) {
      console.error('Wrong shift id to');
      return false;
    }
    if (!employeeShiftChange.employeeShiftChangeDateTo) {
      console.error('Wrong date to');
      return false;
    }

    return true;
  }
}
