import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { VacationAuthorizationInterface, VacationAuthorizationRequestInterface, VacationAuthorizationResponseInterface } from "../interfaces/VacationAuthorizationInterface";

export default class VacationAuthorizationService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
    const { token } = useAuth();
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`,
    };
  }

  async getPendingVacationRequests(employeeId: number): Promise<VacationAuthorizationResponseInterface> {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/vacation-authorizations/pending`, {
      headers,
      query: { employeeId },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });

    return {
      status: responseRequest.status,
      data: responseRequest._data?.data || []
    };
  }

  async authorizeVacationRequests(authorizationData: VacationAuthorizationRequestInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    console.log('Preparing authorization data:', authorizationData);

    // Crear FormData para multipart/form-data
    const formData = new FormData();
    formData.append('signature', authorizationData.signature);
    formData.append('vacationSettingId', authorizationData.vacationSettingId.toString());

    // Agregar cada request ID
    authorizationData.requests.forEach((requestId) => {
      formData.append('requests[]', requestId.toString());
    });

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await $fetch(`${this.API_PATH}/vacation-authorizations`, {
        headers,
        method: "POST",
        body: formData,
        onResponse({ response }) {
          console.log('Authorization response:', response);
          responseRequest = response;
        },
        onRequestError({ response }) {
          console.log('Authorization error:', response);
          responseRequest = response;
        },
      });
    } catch (error) {
      console.error('Authorization request failed:', error);
      throw error;
    }

    return responseRequest;
  }

  validateAuthorizationData(authorizationData: VacationAuthorizationRequestInterface): boolean {
    if (!authorizationData.signature) {
      console.error("Signature is required");
      return false;
    }
    if (!authorizationData.requests || authorizationData.requests.length === 0) {
      console.error("At least one request is required");
      return false;
    }
    if (!authorizationData.vacationSettingId) {
      console.error("Vacation setting ID is required");
      return false;
    }
    return true;
  }
}
