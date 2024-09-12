import type { AircraftProceedingFileInterface } from "../interfaces/AircraftProceedingFileInterface"

export default class AircraftProceedingFileService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getByAircraft(aircraftId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftId}/proceeding-files`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store (aircraftProceedingFile: AircraftProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-proceeding-files`, {
        method: 'POST',
        query: { ...aircraftProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (aircraftProceedingFile: AircraftProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFile.aircraftProceedingFileId}`, {
        method: 'PUT',
        query: { ...aircraftProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (aircraftProceedingFile: AircraftProceedingFileInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFile.aircraftProceedingFileId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (aircraftProceedingFileId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFileId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const aircraftProceedingFile = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          aircraftProceedingFile: aircraftProceedingFile
        }
      }
    }
  }

  validateInfo(aircraftProceedingFile: AircraftProceedingFileInterface): boolean {
    if (!aircraftProceedingFile.proceedingFileId) {
      console.error('Wrong proceeding file id');
      return false;
    }
    if (!aircraftProceedingFile.aircraftId) {
      console.error('Wrong aircraft id');
      return false;
    }
    return true;
  }
}
