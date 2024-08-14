import type { PilotInterface } from "../interfaces/PilotInterface"

export default class PilotService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/pilots`, {
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
      await $fetch(`${this.API_PATH}/pilots/${id}`, {
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

    await $fetch(`${this.API_PATH}/pilots/${pilot.pilotId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async updatePhoto(pilotId: number, photo: any) {
    let responseRequest: any = null
    // send request to send photo like multipart/form-data
    const formData = new FormData()
    formData.append('photo', photo)
    try {
      await $fetch(`${this.API_PATH}/pilots/${pilotId}/photo`, {
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
