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

    async store(proceedingFile: ProceedingFileInterface, file: any) {
      const formData = new FormData()
      formData.append('file', file)
      for (const key in proceedingFile) {
        if (proceedingFile.hasOwnProperty(key)) {
          if (proceedingFile[key] === undefined) {
            proceedingFile[key] = ''
          }
          formData.append(key, proceedingFile[key])
        }
      }
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/proceeding-files`, {
        method: 'POST',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  
    async update(proceedingFile: ProceedingFileInterface, file: any | null) {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }
      for (const key in proceedingFile) {
        if (proceedingFile.hasOwnProperty(key)) {
          if (proceedingFile[key] === undefined || proceedingFile[key] === 'null') {
            proceedingFile[key] = ''
          }
          formData.append(key, proceedingFile[key])
        }
      }
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/proceeding-files/${proceedingFile.proceedingFileId}`, {
        method: 'PUT',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  }
  