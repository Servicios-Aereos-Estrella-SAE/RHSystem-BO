
import type { EmployeeEmergencyContactInterface } from "../interfaces/EmployeeEmergencyContactInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeEmergencyContactService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }


  async store(employeeEmergencyContact: EmployeeEmergencyContactInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-emergency-contacts`, {
        headers,
        method: 'POST',
        body: { ...employeeEmergencyContact },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeEmergencyContact: EmployeeEmergencyContactInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-emergency-contacts/${employeeEmergencyContact.employeeEmergencyContactId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeEmergencyContact },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeEmergencyContact: EmployeeEmergencyContactInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-emergency-contacts/${employeeEmergencyContact.employeeEmergencyContactId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeEmergencyContactId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-emergency-contacts/${employeeEmergencyContactId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeEmergencyContact = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeEmergencyContact: employeeEmergencyContact
        }
      }
    }
  }

  async getByEmployeeId(employeeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-emergency-contacts/employee/${employeeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    // La respuesta del API ya viene con la estructura correcta
    return responseRequest
  }

  validateInfo(employeeEmergencyContact: EmployeeEmergencyContactInterface): boolean {

    const hasAtLeastOneField = this.hasAtLeastOneField(employeeEmergencyContact);

    if (hasAtLeastOneField) {
      if (!employeeEmergencyContact.employeeEmergencyContactFirstname) {
        console.error('Wrong firstname');
        return false;
      }
      if (!employeeEmergencyContact.employeeEmergencyContactLastname) {
        console.error('Wrong lastname');
        return false;
      }
      if (!employeeEmergencyContact.employeeEmergencyContactSecondLastname) {
        console.error('Wrong secondlastname');
        return false;
      }
      if (!employeeEmergencyContact.employeeEmergencyContactRelationship) {
        console.error('Wrong relationship');
        return false;
      }
      if (!employeeEmergencyContact.employeeEmergencyContactPhone) {
        console.error('Wrong phone');
        return false;
      }
      if (!employeeEmergencyContact.employeeId) {
        console.error('Wrong employee id');
        return false;
      }
    }

    return true;
  }

  hasAtLeastOneField(employeeEmergencyContact: EmployeeEmergencyContactInterface): boolean {
    const fields = [
      employeeEmergencyContact.employeeEmergencyContactFirstname,
      employeeEmergencyContact.employeeEmergencyContactLastname,
      employeeEmergencyContact.employeeEmergencyContactSecondLastname,
      employeeEmergencyContact.employeeEmergencyContactRelationship,
      employeeEmergencyContact.employeeEmergencyContactPhone,
    ];

    const hasAtLeastOneField = fields.some(field => field);
    if (hasAtLeastOneField) {
      return true
    }
    return false
  }
}
