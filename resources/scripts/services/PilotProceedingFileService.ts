
import type { PilotProceedingFileInterface } from "../interfaces/PilotProceedingFileInterface"

export default class PilotProceedingFileService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByPilot(pilotId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/pilots/${pilotId}/proceeding-files`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }


  async store (pilotProceedingFile: PilotProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/pilots-proceeding-files`, {
        method: 'POST',
        query: { ...pilotProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (pilotProceedingFile: PilotProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/pilots-proceeding-files/${pilotProceedingFile.pilotProceedingFileId}`, {
        method: 'PUT',
        query: { ...pilotProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (pilotProceedingFile: PilotProceedingFileInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/pilots-proceeding-files/${pilotProceedingFile.pilotProceedingFileId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (pilotProceedingFileId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/pilots-proceeding-files/${pilotProceedingFileId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const pilotProceedingFile = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          pilotProceedingFile: pilotProceedingFile
        }
      }
    }
  }

  validateInfo(pilotProceedingFile: PilotProceedingFileInterface): boolean {
    if (!pilotProceedingFile.proceedingFileId) {
      console.error('Wrong proceeding file id');
      return false;
    }
    if (!pilotProceedingFile.pilotId) {
      console.error('Wrong pilot id');
      return false;
    }
    return true;
  }
}
