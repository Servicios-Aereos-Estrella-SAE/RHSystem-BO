export default class HolidayService {
  protected API_PATH: string

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string,firstDate:string | null, lastDate: string | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/holidays`, {
      query: {
        search: searchText,
        firstDate,
        lastDate,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

   async show(id: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/holidays/${id}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const holiday = responseRequest.status === 200 ? responseRequest._data.data : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              holiday: holiday
            }
          }
        }
    } catch (error) {
    }
  }

  async update(holiday: HolidayInterface, iconId: number = 0) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/holidays/${holiday.holidayId}`, {
        method: 'PUT',
        query: { ...holiday },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async store(holiday: HolidayInterface, iconId: number = 0) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/holidays`, {
        method: 'POST',
        query: { ...holiday },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getIconList() {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/icons`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async delete(holiday: HolidayInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/holidays/${holiday.holidayId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}