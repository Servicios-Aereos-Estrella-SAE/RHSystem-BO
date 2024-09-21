
import type { FlightAttendantProceedingFileInterface } from "../interfaces/FlightAttendantProceedingFileInterface"

export default class FlightAttendantProceedingFileService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByFlightAttendant(flightAttendantId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/flight-attendants/${flightAttendantId}/proceeding-files`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }


  async store (flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendant-proceeding-files`, {
        method: 'POST',
        query: { ...flightAttendantProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendant-proceeding-files/${flightAttendantProceedingFile.flightAttendantProceedingFileId}`, {
        method: 'PUT',
        query: { ...flightAttendantProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/flight-attendant-proceeding-files/${flightAttendantProceedingFile.flightAttendantProceedingFileId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (flightAttendantProceedingFileId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/flight-attendant-proceeding-files/${flightAttendantProceedingFileId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const flightAttendantProceedingFile = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          flightAttendantProceedingFile: flightAttendantProceedingFile
        }
      }
    }
  }

  validateInfo(flightAttendantProceedingFile: FlightAttendantProceedingFileInterface): boolean {
    if (!flightAttendantProceedingFile.proceedingFileId) {
      console.error('Wrong proceeding file id');
      return false;
    }
    if (!flightAttendantProceedingFile.flightAttendantId) {
      console.error('Wrong flight attendant id');
      return false;
    }
    return true;
  }

  async getExpiresAndExpiring(dateStart: string, dateEnd: string) {
    const query = { 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/flight-attendant-proceeding-files/get-expired-and-expiring`, {
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
