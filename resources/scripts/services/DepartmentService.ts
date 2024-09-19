import { tr } from "date-fns/locale";
import type { DepartmentInterface } from "../interfaces/DepartmentInterface"

export default class DepartmentService {
 
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
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
  async getAllDepartmentList () {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
  async getSearchDepartmentList(search: string, currentPage: number, rowsPerPage: number) {
    let responseRequest: any = null
  
    await $fetch(`${this.API_PATH}/departments/search`, {
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

    await $fetch(`${this.API_PATH}/departments/${departmentId}/positions`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (departmentId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments/`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.departments : []
    const department = list.find((item: DepartmentInterface) => item.departmentId === departmentId)

    return {
      status: responseRequest.status,
      _data: {
        data: {
          department: department
        }
      }
    }
  }

  async assignShift (departmentId: number, shiftId: number, applySince: string) {
    let responseRequest: any = null
    const query = { 'shiftId': shiftId,  'applySince': applySince }
    try {
      await $fetch(`${this.API_PATH}/department/assign-shift/${departmentId}`, {
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

    await $fetch(`${this.API_PATH}/departments/${data.departmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(data: DepartmentInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments`, {
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

    await $fetch(`${this.API_PATH}/departments/${departmentId}`, {
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
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/departments-positions`, {
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
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/departments-positions/${departmentId}/${positionId}`, {
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
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/positions/${positionId}`, {
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
  
    await $fetch(`${this.API_PATH}/departments/${department.departmentId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });
  
    return responseRequest;
  }
  
}
