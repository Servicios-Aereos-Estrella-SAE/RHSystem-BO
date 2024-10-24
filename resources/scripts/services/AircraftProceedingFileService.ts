import type { AircraftProceedingFileInterface } from "../interfaces/AircraftProceedingFileInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AircraftProceedingFileService {
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

  async getByAircraft(aircraftId: number, fileTypeId?: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftId}/proceeding-files`, {
      headers,
      query: { type: fileTypeId },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store (aircraftProceedingFile: AircraftProceedingFileInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-proceeding-files`, {
        headers,
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
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFile.aircraftProceedingFileId}`, {
        headers,
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
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFile.aircraftProceedingFileId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (aircraftProceedingFileId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/${aircraftProceedingFileId}`, {
      headers,
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

  async getExpiresAndExpiring(dateStart: string, dateEnd: string) {
    const headers = { ...this.GENERAL_HEADERS }
    const query = { 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-proceeding-files/get-expired-and-expiring`, {
      headers,
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    return responseRequest
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
