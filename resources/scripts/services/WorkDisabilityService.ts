import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { WorkDisabilityInterface } from "../interfaces/WorkDisabilityInterface";

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

  async store(workDisability: WorkDisabilityInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    try {
      await $fetch(`${this.API_PATH}/work-disabilities`, {
        headers,
        method: "POST",
        body: { ...workDisability },
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        },
      });
    } catch (error) { }
    return responseRequest;
  }

  async update(workDisability: WorkDisabilityInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    try {
      await $fetch(
        `${this.API_PATH}/work-disabilities/${workDisability.workDisabilityId}`,
        {
          headers,
          method: "PUT",
          body: { ...workDisability },
          onResponse({ response }) {
            responseRequest = response;
          },
          onRequestError({ response }) {
            responseRequest = response;
          },
        }
      );
    } catch (error) { }
    return responseRequest;
  }

  async delete(workDisability: WorkDisabilityInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(
      `${this.API_PATH}/work-disabilities/${workDisability.workDisabilityId}`,
      {
        headers,
        method: "DELETE",
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        },
      }
    );

    return responseRequest;
  }

  async show(workDisabilityId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/work-disabilities/${workDisabilityId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const workDisability =
      responseRequest.status === 200 ? responseRequest._data.data.workDisability : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          workDisability: workDisability,
        },
      },
    };
  }
}
