import type { EmployeeInterface } from "../interfaces/EmployeeInterface"
import type { PeopleInterface } from "../interfaces/PeopleInterface"

export default class EmployeeService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, departmentId: number | null, positionId: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees`, {
      query: {
        search: searchText,
        departmentId,
        positionId,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(employee: EmployeeInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees`, {
        method: 'POST',
        query: { ...employee },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employee: EmployeeInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${employee.employeeId}`, {
        method: 'PUT',
        query: { ...employee },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(id: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees/${id}`, {
        onResponse ({ response }) { responseRequest = response },
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
    if (!employee.departmentId) {
      console.error('Wrong department id');
      return false;
    }
    if (!employee.positionId) {
      console.error('Wrong position id');
      return false;
    }
    if (!employee.employeeHireDate) {
      console.error('Wrong hire date');
      return false;
    }

    // if (!employee.person?.personGender) {
    //   console.error('Wrong Gender:', employee.person?.personGender)
    //   return false
    // }

    if (!employee.employeePayrollNum) {
      console.error('Wrong payroll number');
      return false;
    }

    // validate employee.person.personPhone is a valid phone number with 10 digits and dont have letters
    if (employee.person?.personPhone && !/^\d{10}$/.test(employee.person.personPhone)) {
      console.error('Wrong phone number');
      return false;
    }

    return true;
  }

  async getOnlyWithOutUser (searchText: string, department: number | null, position: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees/without-user`, {
      query: {
        search: searchText,
        department,
        position,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async delete(employee: EmployeeInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees/${employee.employeeId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async storePerson(person: PeopleInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons`, {
        method: 'POST',
        query: { ...person },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async updatePerson(person: PeopleInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons/${person.personId}`, {
        method: 'PUT',
        query: { ...person },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
  async updatePhoto(employeeId: number, photo: any) {
    let responseRequest: any = null
    console.log('updatePhoto', employeeId, photo)
    // send request to send photo like multipart/form-data
    const formData = new FormData()
    formData.append('photo', photo)
    try {
      await $fetch(`${this.API_PATH}/employees/${employeeId}/photo`, {
        method: 'PUT',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
