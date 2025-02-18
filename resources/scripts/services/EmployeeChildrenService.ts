
import type { EmployeeChildrenInterface } from "../interfaces/EmployeeChildrenInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeChildrenService {
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


  async store (employeeChildren: EmployeeChildrenInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-children`, {
        headers,
        method: 'POST',
        query: { ...employeeChildren },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (employeeChildren: EmployeeChildrenInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-children/${employeeChildren.employeeChildrenId}`, {
        headers,
        method: 'PUT',
        query: { ...employeeChildren },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (employeeChildren: EmployeeChildrenInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-children/${employeeChildren.employeeChildrenId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (employeeChildrenId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-children/${employeeChildrenId}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const employeeChildren = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeChildren: employeeChildren
        }
      }
    }
  }

  validateInfo(employeeChildren: EmployeeChildrenInterface): boolean {
    if (!employeeChildren.employeeChildrenFirstname) {
      console.error('Wrong firstname');
      return false;
    }
    if (!employeeChildren.employeeChildrenLastname) {
      console.error('Wrong lastname');
      return false;
    }
    if (!employeeChildren.employeeChildrenSecondLastname) {
      console.error('Wrong secondlastname');
      return false;
    }
    if (!employeeChildren.employeeChildrenGender) {
      console.error('Wrong gender');
      return false;
    }
    if (!employeeChildren.employeeChildrenBirthday) {
      console.error('Wrong birtday');
      return false;
    }
    if (!employeeChildren.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    return true;
  }
}
