import type { PilotInterface } from "../interfaces/PilotInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class PilotService {
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
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/pilots`, {
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

  async store(pilot: PilotInterface, photo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in pilot) {
      if (pilot.hasOwnProperty(key)) {
        if (pilot[key] === undefined || pilot[key] === 'null') {
          pilot[key] = ''
        }
        formData.append(key, pilot[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/pilots`, {
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

  async update(pilot: PilotInterface, photo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (photo) {
      formData.append('photo', photo)
    }
    for (const key in pilot) {
      if (pilot.hasOwnProperty(key)) {
        if (pilot[key] === undefined || pilot[key] === 'null') {
          pilot[key] = ''
        }
        formData.append(key, pilot[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/pilots/${pilot.pilotId}`, {
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
      await $fetch(`${this.API_PATH}/pilots/${id}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const pilot = responseRequest.status === 200 ? responseRequest._data.data.pilot : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              pilot: pilot
            }
          }
        }
    } catch (error) {
    }
  }

  validatePilotInfo(pilot: PilotInterface): boolean {
    // validate pilot.person.personPhone is a valid phone number with 10 digits and dont have letters
    if (!pilot.person?.personFirstname) {
      console.error('Wrong first name');
      return false;
    }
    if (!pilot.person?.personLastname) {
      console.error('Wrong last name');
      return false;
    }
    if (!pilot.person?.personSecondLastname) {
      console.error('Wrong second lastname');
      return false;
    }
    if (!pilot.pilotHireDate) {
      console.error('Wrong hire date');
      return false;
    }

    return true;
  }

  async delete(pilot: PilotInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/pilots/${pilot.pilotId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
