
import type { EmployeeSpouseInterface } from "../interfaces/EmployeeSpouseInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeSpouseService {
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


  async store(employeeSpouse: EmployeeSpouseInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-spouses`, {
        headers,
        method: 'POST',
        body: { ...employeeSpouse },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeSpouse: EmployeeSpouseInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-spouses/${employeeSpouse.employeeSpouseId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeSpouse },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeSpouse: EmployeeSpouseInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-spouses/${employeeSpouse.employeeSpouseId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeSpouseId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-spouses/${employeeSpouseId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeSpouse = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeSpouse: employeeSpouse
        }
      }
    }
  }

  validateInfo(employeeSpouse: EmployeeSpouseInterface): boolean {
    if (!employeeSpouse.employeeSpouseFirstname) {
      console.error('Wrong firstname');
      return false;
    }
    if (!employeeSpouse.employeeSpouseLastname) {
      console.error('Wrong lastname');
      return false;
    }
    if (!employeeSpouse.employeeSpouseSecondLastname) {
      console.error('Wrong secondlastname');
      return false;
    }
    if (!employeeSpouse.employeeSpouseOcupation) {
      console.error('Wrong ocupation');
      return false;
    }
    if (!employeeSpouse.employeeSpouseBirthday) {
      console.error('Wrong birtday');
      return false;
    }
    if (!employeeSpouse.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    return true;
  }
}
