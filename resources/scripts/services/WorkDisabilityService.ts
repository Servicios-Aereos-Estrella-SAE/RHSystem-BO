import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { ExceptionRequestInterface } from "../interfaces/ExceptionRequestInterface";
import type { ShiftExceptionRequestInterface } from "../interfaces/ShiftExceptionRequestInterface";

export default class WorkDisabilityService {
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

  

  async getByEmployee(employeeId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/work-disabilities/employee/${employeeId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
   
    return responseRequest;
  }
}
