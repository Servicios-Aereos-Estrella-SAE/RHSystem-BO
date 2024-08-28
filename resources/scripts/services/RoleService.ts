
export default class RoleService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/roles`, {
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

  async assign(roleId: number, permissions: Array<any>) {
    let responseRequest: any = null
    const formData = new FormData()
    permissions.forEach((systemPermissionId) => {
      formData.append('permissions[]', systemPermissionId);
    })
    try {
      await $fetch(`${this.API_PATH}/roles/assign/${roleId}`, {
        method: 'POST',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
