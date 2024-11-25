import type { DepartmentInterface } from "../interfaces/DepartmentInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class DepartmentService {
 
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface
  
  constructor () {
    const { token } = useAuth()
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async syncDepartments() {
    let responseRequest: { status: number; _data?: any; error?: any } = { status: 500 };

    try {
      const response = await fetch(`${this.API_PATH}/synchronization/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  }),
      });

      const data = await response.json();
      responseRequest = { status: response.status, _data: data };
    } catch (error) {
      responseRequest = { status: 500, error };
    }

    return responseRequest;
  }

  async getAllDepartmentList (filters?: Object) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments`, {
      headers,
      query: filters,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getSearchOrganization(search: string, currentPage: number, rowsPerPage: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
  
    await $fetch(`${this.API_PATH}/departments/organization`, {
      headers,
      query: {
        departmentName: search,
        currentPage,
        rowsPerPage
      },
      onResponse({ response }) {
        responseRequest = response
      },
      onRequestError({ response }) {
        responseRequest = response
      }
    })

    if (responseRequest?.data) {
      return {
        data: responseRequest.data.data,
        meta: responseRequest.data.meta
      }
    }
    return responseRequest  
  }

  async getDepartmentPositions (departmentId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${departmentId}/positions`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (departmentId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${departmentId}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async assignShift (departmentId: number, shiftId: number, applySince: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    const query = { 'shiftId': shiftId,  'applySince': applySince }
    try {
      await $fetch(`${this.API_PATH}/department/assign-shift/${departmentId}`, {
        headers,
        method: 'POST',
        query: { ...query },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(data: DepartmentInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${data.departmentId}`, {
      headers,
      method: 'PUT',
      body: JSON.stringify(data),
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(data: DepartmentInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  validate(data: DepartmentInterface) {
    return data.departmentName && data.departmentCode
  }

  async showOnSave (departmentId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${departmentId}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const department = responseRequest.status === 200 ? responseRequest._data.data.department : {}

    return {
      status: responseRequest.status,
      _data: {
        data: {
          department: department
        }
      }
    }
  }

  async assignDepartment(positionId: number, departmentId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/departments-positions`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ positionId, departmentId }),
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) {
          console.error('response error', response)
          responseRequest = response
        }
      })
      return responseRequest
    } catch (error: any) {
      responseRequest = error.data
    }
    return responseRequest
  }

  async unAssignDepartment(positionId: number, departmentId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/departments-positions/${departmentId}/${positionId}`, {
        headers,
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) {
          console.error('response error', response)
          responseRequest = response
        }
      })
      return responseRequest
    } catch (error: any) {
      responseRequest = error.data
    }
    return responseRequest
  }

  async softDeleteDepartmentPosition(positionId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/positions/${positionId}`, {
        headers,
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) {
          console.error('response error', response);
          responseRequest = response;
        }
      });
      return responseRequest;
    } catch (error: any) {
      responseRequest = error.data;
    }
    return responseRequest;
  }
  
  async delete(department: DepartmentInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${department.departmentId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });
  
    return responseRequest;
  }

  async forceDelete(department: DepartmentInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/departments/${department.departmentId}/force-delete`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });
  
    return responseRequest;
  }

  async getRotationIndex (departmentId: number,dateStart: string, dateEnd: string) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    const query = { 'dateStart': dateStart,  'dateEnd': dateEnd }
    await $fetch(`${this.API_PATH}/departments/${departmentId}/get-rotation-index`, {
      query,
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
  
}
