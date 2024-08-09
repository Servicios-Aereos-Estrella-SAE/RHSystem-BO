import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { ProceedingFileInterface } from "../interfaces/ProceedingFileInterface"

export default class ProceedingFileService {
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
  
    async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
      const headers = { ...this.GENERAL_HEADERS }
      let responseRequest: any = null
  
      await $fetch(`${this.API_PATH}/proceeding-files`, {
        headers,
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
      const headers = { ...this.GENERAL_HEADERS }
      let responseRequest: any = null;
  
      await $fetch(`${this.API_PATH}/proceeding-files/${proceedingFiles.proceedingFileId}`, {
        headers,
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      });
  
      return responseRequest;
    }

    async store(proceedingFile: ProceedingFileInterface, file: any) {
      const headers = { ...this.GENERAL_HEADERS }
      const formData = new FormData()
      formData.append('file', file)
      for (const key in proceedingFile) {
        if (proceedingFile.hasOwnProperty(key)) {
          if (proceedingFile[key] === undefined || proceedingFile[key] === 'null') {
            proceedingFile[key] = ''
          }
          formData.append(key, proceedingFile[key])
        }
      }
      let responseRequest: any = null
      try {
        await $fetch(`${this.API_PATH}/proceeding-files`, {
          headers,
          method: 'POST',
          body: formData,
          onResponse({ response }) { responseRequest = response },
          onRequestError({ response }) { responseRequest = response }
        })
      } catch (error) {
        
      }
      return responseRequest
    }
  
    async update(proceedingFile: ProceedingFileInterface, file: any | null) {
      const headers = { ...this.GENERAL_HEADERS }
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
        headers,
        method: 'PUT',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  }
  