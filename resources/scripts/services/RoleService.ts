
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

  async assign(roleId: number, permissions: Array<any>, departments: Array<any>) {
    let responseRequest: any = null
    const formData = new FormData()
    permissions.forEach((systemPermissionId) => {
      formData.append('permissions[]', systemPermissionId);
    })
    departments.forEach((departmentId) => {
      formData.append('departments[]', departmentId);
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


  async show(roleId: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/${roleId}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const role = responseRequest.status === 200 ? responseRequest._data.data.role : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              role: role
            }
          }
        }
    } catch (error) {
    }
  }

  async hasAccess(roleId: number, systemModuleSlug: string, systemPermissionSlug: string) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/has-access/${roleId}/${systemModuleSlug}/${systemPermissionSlug}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const roleHasAccess = responseRequest.status === 200 ? responseRequest._data.data.roleHasAccess : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              roleHasAccess: roleHasAccess
            }
          }
        }
    } catch (error) {
    }
  }

  async hasAccessDepartment(roleId: number, departmentId: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/has-access-department/${roleId}/${departmentId}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const roleHasAccess = responseRequest.status === 200 ? responseRequest._data.data.roleHasAccess : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              roleHasAccess: roleHasAccess
            }
          }
        }
    } catch (error) {
    }
  }

  async getAccessByModule(roleId: number, systemModuleSlug: string) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/get-access-by-module/${roleId}/${systemModuleSlug}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const permissions = responseRequest.status === 200 ? responseRequest._data.data.permissions : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              permissions: permissions
            }
          }
        }
    } catch (error) {
    }
  }

  async getAccess(roleId: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/get-access/${roleId}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const permissions = responseRequest.status === 200 ? responseRequest._data.data.permissions : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              permissions: permissions
            }
          }
        }
    } catch (error) {
    }
  }
}
