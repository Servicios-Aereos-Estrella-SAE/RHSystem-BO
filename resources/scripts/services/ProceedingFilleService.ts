import type { ProceedingFileInterface } from "../interfaces/ProceedingFileInterface"

export default class ProceedingFileService {
    protected API_PATH: string
  
    constructor () {
      const CONFIG = useRuntimeConfig()
      this.API_PATH = CONFIG.public.BASE_API_PATH
    }
  
    async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
      let responseRequest: any = null
  
      await $fetch(`${this.API_PATH}/proceeding-files`, {
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

    async delete(proceedingFiles: ProceedingFileInterface) {
      let responseRequest: any = null;
  
      await $fetch(`${this.API_PATH}/proceeding-files/${proceedingFiles.proceedingFileId}`, {
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      });
  
      return responseRequest;
    }

    async create(proceedingFiles: ProceedingFileInterface) {
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/proceeding-files`, {
        method: 'POST',
        body: proceedingFiles,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  
    async update(proceedingFiles: ProceedingFileInterface) {
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/proceeding-files/${proceedingFiles.proceedingFileId}`, {
        method: 'PUT',
        body: proceedingFiles,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  }
  