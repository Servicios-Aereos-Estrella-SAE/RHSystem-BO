import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { UserResponsibleEmployeeInterface } from "../interfaces/UserResponsibleEmployeeInterface"

export default class UserResponsibleEmployeeService {
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


  async store(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    try {
      const response = await $fetch(`${this.API_PATH}/user-responsible-employees`, {
        headers,
        method: 'POST',
        body: { ...userResponsibleEmployee },
      })
      return {
        status: 200,
        _data: response,
      }
    } catch (error: any) {
      return {
        status: error?.response?.status || 500,
        _data: {
          error: error?.response?._data?.message || error.message || 'Unknown error',
        },
      }
    }
  }

  async update(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/user-responsible-employees/${userResponsibleEmployee.userResponsibleEmployeeId}`, {
        headers,
        method: 'PUT',
        body: userResponsibleEmployee,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest;
  }

  async delete(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/user-responsible-employees/${userResponsibleEmployee.userResponsibleEmployeeId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(userResponsibleEmployeeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/user-responsible-employees/${userResponsibleEmployeeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const userResponsibleEmployee = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          userResponsibleEmployee: userResponsibleEmployee
        }
      }
    }
  }

  async getByEmployee(employeeId: number, userId?: number | null) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/${employeeId}/user-responsible/${userId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async getAssignedByEmployee(userId: number, searchText: string, departmentId: number | null, positionId: number | null, employeeId: number | null) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/users/${userId}/employees-assigned`, {
      headers,
      query: {
        employeeId,
        search: searchText,
        departmentId,
        positionId,
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  validateInfo(userResponsibleEmployee: UserResponsibleEmployeeInterface): boolean {
    if (!userResponsibleEmployee.userId) {
      console.error('Wrong user id');
      return false;
    }
    if (!userResponsibleEmployee.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    return true;
  }

}
