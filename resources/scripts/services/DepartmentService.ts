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
}
