export default class AssistService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async index (
    date: string | Date,
    dateEnd: string | Date,
    employee: number,
    page: number = 1,
    limit: number = 999999999
  ) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/v1/assists`, {
      query: {
        date,
        'date-end': dateEnd,
        employee,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async sync () {
    let responseRequest: any = null
    const payload = { date: '2024-05-01', page: 1 }

    await $fetch(`${this.API_PATH}/v1/assists/synchronize`, {
      method: 'POST',
      query: { ...payload },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    console.log('🚀 ------------------------------------------------------------🚀')
    console.log('🚀 ~ AssistService ~ sync ~ responseRequest:', responseRequest)
    console.log('🚀 ------------------------------------------------------------🚀')

    return responseRequest
  }
}
