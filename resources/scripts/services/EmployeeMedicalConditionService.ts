import type { EmployeeMedicalConditionInterface } from "../interfaces/EmployeeMedicalConditionInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeMedicalConditionService {
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

  async getByEmployee(employeeId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employee-medical-conditions/employee/${employeeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.employeeMedicalConditions : []
    return list
  }

  async store(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-medical-conditions`, {
        headers,
        method: 'POST',
        body: { ...employeeMedicalCondition },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-medical-conditions/${employeeMedicalCondition.employeeMedicalConditionId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeMedicalCondition },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-medical-conditions/${employeeMedicalCondition.employeeMedicalConditionId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeMedicalConditionId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-medical-conditions/${employeeMedicalConditionId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeMedicalCondition = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeMedicalCondition: employeeMedicalCondition
        }
      }
    }
  }

  validateInfo(employeeMedicalCondition: EmployeeMedicalConditionInterface): boolean {
    if (!employeeMedicalCondition.medicalConditionTypeId) {
      console.error('Wrong medical condition type id');
      return false;
    }
    if (!employeeMedicalCondition.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    return true;
  }
}
