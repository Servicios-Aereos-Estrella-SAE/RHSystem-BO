
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { RoleInterface } from "../interfaces/RoleInterface"

export default class RoleService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/roles`, {
      headers,
      query: {
        search: searchText,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async assign(roleId: number, permissions: Array<any>, roleManagementDays: number | null) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    const formData = new FormData()
    formData.append('roleManagementDays', roleManagementDays !== null ? roleManagementDays.toString() : '');
    permissions.forEach((systemPermissionId) => {
      formData.append('permissions[]', systemPermissionId);
    })
    try {
      await $fetch(`${this.API_PATH}/roles/assign/${roleId}`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async store(role: RoleInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/roles`, {
        headers,
        method: 'POST',
        body: role,
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        }
      });
    } catch (error) {
      console.error(error);
    }
    return responseRequest;
  }

  async update(role: RoleInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/roles/${role.roleId}`, {
        headers,
        method: 'PUT',
        body: role,
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        }
      });
    } catch (error) {
      console.error(error);
    }
    return responseRequest;
  }

  async show(roleId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/${roleId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
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

  async delete(role: RoleInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/roles/${role.roleId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async hasAccess(roleId: number, systemModuleSlug: string, systemPermissionSlug: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/roles/has-access/${roleId}/${systemModuleSlug}/${systemPermissionSlug}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
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
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/roles/has-access-department/${roleId}/${departmentId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
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
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/roles/get-access-by-module/${roleId}/${systemModuleSlug}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
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
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/roles/get-access/${roleId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
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

  validateInfo(role: RoleInterface): boolean {
    if (!role.roleName) {
      console.error('Wrong name');
      return false;
    }
    return true;
  }
}
