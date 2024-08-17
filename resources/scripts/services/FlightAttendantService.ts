import type { FlightAttendantInterface } from "../interfaces/FlightAttendantInterface"

export default class FlightAttendantService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/flight-attendants`, {
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
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/flight-attendants/${id}`, {
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

    await $fetch(`${this.API_PATH}/flight-attendants/${flightAttendant.flightAttendantId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async updatePhoto(flightAttendantId: number, photo: any) {
    let responseRequest: any = null
    // send request to send photo like multipart/form-data
    const formData = new FormData()
    formData.append('photo', photo)
    try {
      await $fetch(`${this.API_PATH}/flight-attendants/${flightAttendantId}/photo`, {
        method: 'PUT',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
