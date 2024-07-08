import type { ShiftInterface } from "../interfaces/ShiftInterface"

export default class ShiftService {
    protected API_PATH: string
  
    constructor () {
      const CONFIG = useRuntimeConfig()
      this.API_PATH = CONFIG.public.BASE_API_PATH
    }
  
    async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
      let responseRequest: any = null
  
      await $fetch(`${this.API_PATH}/shift`, {
        query: {
          shiftName: searchText,
          page,
          limit
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

    async delete(shift: ShiftInterface) {
      let responseRequest: any = null;
  
      await $fetch(`${this.API_PATH}/shift/${shift.shiftId}`, {
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      });
  
      return responseRequest;
    }

    async create(shift: ShiftInterface) {
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/shift`, {
        method: 'POST',
        body: shift,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  
    async update(shift: ShiftInterface) {
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/shift/${shift.shiftId}`, {
        method: 'PUT',
        body: shift,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  }
  