import type { EmployeeInterface } from "../interfaces/EmployeeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { PeopleInterface } from "../interfaces/PeopleInterface"

export default class EmployeeService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const { token } = useAuth()
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }
  async getFilteredList(searchText: string, departmentId: number | null, positionId: number | null, employeeWorkSchedule: string | null, page: number = 1, limit: number = 999999999, onlyInactive: boolean = false, employeeTypeId: number | null) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/employees`, {
      headers,
      query: {
        search: searchText,
        departmentId,
        positionId,
        employeeWorkSchedule: employeeWorkSchedule,
        onlyInactive: onlyInactive,
        employeeTypeId,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getBirthday(searchText: string, departmentId: number | null, positionId: number | null, year: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/employees/get-birthday`, {
      headers,
      query: {
        search: searchText,
        departmentId,
        positionId,
        year,
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getVacations(searchText: string, departmentId: number | null, positionId: number | null, year: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/employees/get-vacations`, {
      headers,
      query: {
        search: searchText,
        departmentId,
        positionId,
        year,
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getAllVacationsByPeriod(searchText: string, departmentId: number | null, positionId: number | null, dateStart: string, dateEnd: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/employees/get-all-vacations-by-period`, {
      headers,
      query: {
        search: searchText,
        departmentId,
        positionId,
        dateStart,
        dateEnd,
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(employee: EmployeeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees`, {
        headers,
        method: 'POST',
        body: { ...employee },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employee: EmployeeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employee.employeeId}`, {
        headers,
        method: 'PUT',
        body: { ...employee },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${id}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const employee = responseRequest.status === 200 ? responseRequest._data.data.employee : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            employee: employee
          }
        }
      }
    } catch (error) {
    }
  }

  async getByCode(code: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/get-by-code/${code}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const employee = responseRequest.status === 200 ? responseRequest._data.data.employee : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            employee: employee
          }
        }
      }
    } catch (error) {
    }
  }

  async reactivate(employee: EmployeeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employee.employeeId}/reactivate`, {
        headers,
        method: 'PUT',
        body: { ...employee },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  validateEmployeeInfo(employee: EmployeeInterface): boolean {
    if (!employee.employeeCode) {
      console.error('Wrong employee code');
      return false;
    }
    if (!employee.employeeFirstName) {
      console.error('Wrong employee first name');
      return false;
    }
    if (!employee.employeeLastName) {
      console.error('Wrong employee last name');
      return false;
    }

    if (!employee.employeeTypeId) {
      console.error('Wrong employee type id');
      return false;
    }
    if (!employee.payrollBusinessUnitId) {
      console.error('Wrong payroll business unit id');
      return false;
    }

    return true;
  }

  async getOnlyWithOutUser(searchText: string, department: number | null, position: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/without-user`, {
      headers,
      query: {
        search: searchText,
        department,
        position,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async delete(employee: EmployeeInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/${employee.employeeId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async storePerson(person: PeopleInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons`, {
        headers,
        method: 'POST',
        body: { ...person },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async updatePerson(person: PeopleInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons/${person.personId}`, {
        headers,
        method: 'PUT',
        body: { ...person },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
  async updatePhoto(employeeId: number, photo: any) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    // send request to send photo like multipart/form-data
    const formData = new FormData()
    formData.append('photo', photo)
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/photo`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async synchronization() {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/synchronization/employees`, {
        headers,
        method: 'POST',
        query: {},
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getWorkSchedules() {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/get-work-schedules`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getVacationsUsed(employeeId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/get-vacations-used`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getVacationsCorresponding(employeeId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/get-vacations-corresponding`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getYearsWorked(employeeId: number, year: number | null) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/get-years-worked`, {
        headers,
        query: { year: year },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getVacationsByPeriod(employeeId: number, vacationSettingId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/get-vacations-by-period`, {
        headers,
        query: { vacationSettingId: vacationSettingId },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getExcelAll(
    searchText: string,
    departmentId: number | null,
    positionId: number | null,
    startDate: string,
    endDate: string,
    onlyInactive: boolean,
    employeeTypeId: number | null,
    workSchedule: string | null,
    page: number = 1,
    limit: number = 999999999,
  ) {
    let responseRequest: any = null
    try {
      const query = {
        search: searchText,
        startDate,
        endDate,
        departmentId: departmentId,
        positionId: positionId,
        onlyInactive: onlyInactive,
        workSchedule: workSchedule,
        employeeTypeId: employeeTypeId,
        page: page,
        limit: limit,
      };
      await $fetch(`${this.API_PATH}/employees/employee-generate-excel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getVacationExcel(searchText: string, departmentId: number | null, positionId: number | null,
    startDate: string | Date,
    endDate: string | Date,
    onlyInactive: boolean
  ) {
    let responseRequest: any = null
    try {
      const query = {
        search: searchText,
        startDate: startDate,
        endDate: endDate,
        departmentId: departmentId,
        positionId: positionId,
        onlyInactive: onlyInactive
      }
      await $fetch(`${this.API_PATH}/employees-vacations/get-excel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getDaysWorkDisability(employeeId: number, datePay: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/get-days-work-disability`, {
        headers,
        query: { datePay },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

}

