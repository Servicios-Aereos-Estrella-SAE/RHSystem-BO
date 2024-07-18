
import type { EmployeeShiftInterface } from "../interfaces/EmployeeShiftInterface"

export default class EmployeeShiftService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByEmployee(employeeId: number, shiftId: number | null, dateStart: string | null, dateEnd: string | null) {
    const query = { 'shiftId': shiftId, 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employee-shifts-employee/${employeeId}`, {
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async getShiftActiveByEmployee(employeeId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employee-shifts-active-shift-employee/${employeeId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const employeeShift = responseRequest.status === 200 ? responseRequest._data.data : null
    return employeeShift
  }


  async store (employeeShift: EmployeeShiftInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee_shifts`, {
        method: 'POST',
        query: { ...employeeShift },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (employeeShift: EmployeeShiftInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee_shifts/${employeeShift.employeeShiftId}`, {
        method: 'PUT',
        query: { ...employeeShift },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (employeeShift: EmployeeShiftInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employee_shifts/${employeeShift.employeeShiftId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (employeeShiftId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employee_shifts/${employeeShiftId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
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
