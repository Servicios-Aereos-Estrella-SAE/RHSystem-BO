import type { FlightAttendantInterface } from "../interfaces/FlightAttendantInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class FlightAttendantService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    await $fetch(`${this.API_PATH}/flight-attendants`, {
      headers,
      query: {
        search: searchText,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(flightAttendant: FlightAttendantInterface, photo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in flightAttendant) {
      if (flightAttendant.hasOwnProperty(key)) {
        if (flightAttendant[key] === undefined || flightAttendant[key] === 'null') {
          flightAttendant[key] = ''
        }
        formData.append(key, flightAttendant[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendants`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(flightAttendant: FlightAttendantInterface, photo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in flightAttendant) {
      if (flightAttendant.hasOwnProperty(key)) {
        if (flightAttendant[key] === undefined || flightAttendant[key] === 'null') {
          flightAttendant[key] = ''
        }
        formData.append(key, flightAttendant[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendants/${flightAttendant.flightAttendantId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendants/${id}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const flightAttendant = responseRequest.status === 200 ? responseRequest._data.data.flightAttendant : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              flightAttendant: flightAttendant
            }
          }
        }
    } catch (error) {
    }
  }

  validateFlightAttendantInfo(flightAttendant: FlightAttendantInterface): boolean {
    if (!flightAttendant.person?.personFirstname) {
      console.error('Wrong first name');
      return false;
    }
    if (!flightAttendant.person?.personLastname) {
      console.error('Wrong last name');
      return false;
    }
    if (!flightAttendant.person?.personSecondLastname) {
      console.error('Wrong second lastname');
      return false;
    }
    if (!flightAttendant.flightAttendantHireDate) {
      console.error('Wrong hire date');
      return false;
    }

    return true;
  }

  async delete(flightAttendant: FlightAttendantInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/flight-attendants/${flightAttendant.flightAttendantId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
