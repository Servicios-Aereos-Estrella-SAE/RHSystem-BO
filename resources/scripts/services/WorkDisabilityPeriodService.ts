import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { WorkDisabilityPeriodInterface } from "../interfaces/WorkDisabilityPeriodInterface";

export default class WorkDisabilityPeriodService {
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

  async store(workDisabilityPeriod: WorkDisabilityPeriodInterface, file: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    const formData = new FormData()
    formData.append('workDisabilityPeriodFile', file)
    for (const key in workDisabilityPeriod) {
      if (workDisabilityPeriod.hasOwnProperty(key)) {
        if (workDisabilityPeriod[key] === undefined || workDisabilityPeriod[key] === 'null') {
          workDisabilityPeriod[key] = ''
        }
        formData.append(key, workDisabilityPeriod[key])
      } 
    }
    try {
      await $fetch(`${this.API_PATH}/work-disability-periods`, {
        headers,
        method: "POST",
        body: formData,
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

  async update(workDisabilityPeriod: WorkDisabilityPeriodInterface, file: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    const formData = new FormData()
    formData.append('workDisabilityPeriodFile', file)
    for (const key in workDisabilityPeriod) {
      if (workDisabilityPeriod.hasOwnProperty(key)) {
        if (workDisabilityPeriod[key] === undefined || workDisabilityPeriod[key] === 'null') {
          workDisabilityPeriod[key] = ''
        }
        formData.append(key, workDisabilityPeriod[key])
      }
    }
    try {
      await $fetch(
        `${this.API_PATH}/work-disability-periods/${workDisabilityPeriod.workDisabilityPeriodId}`,
        {
          headers,
          method: "PUT",
          body: formData,
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

  async delete(workDisabilityPeriod: WorkDisabilityPeriodInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(
      `${this.API_PATH}/work-disability-periods/${workDisabilityPeriod.workDisabilityPeriodId}`,
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

  async show(workDisabilityPeriodId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/work-disability-periods/${workDisabilityPeriodId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const workDisabilityPeriod =
      responseRequest.status === 200 ? responseRequest._data.data.workDisabilityPeriod : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          workDisabilityPeriod: workDisabilityPeriod,
        },
      },
    };
  }
}
