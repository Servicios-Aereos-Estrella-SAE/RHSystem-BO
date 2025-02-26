import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { WorkDisabilityPeriodExpenseInterface } from "../interfaces/WorkDisabilityPeriodExpenseInterface";

export default class WorkDisabilityPeriodExpenseService {
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

  async store(workDisabilityPeriodExpense: WorkDisabilityPeriodExpenseInterface, file: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    const formData = new FormData()
    formData.append('workDisabilityPeriodExpenseFile', file)
    for (const key in workDisabilityPeriodExpense) {
      if (workDisabilityPeriodExpense.hasOwnProperty(key)) {
        if (workDisabilityPeriodExpense[key] === undefined || workDisabilityPeriodExpense[key] === 'null') {
          workDisabilityPeriodExpense[key] = ''
        }
        formData.append(key, workDisabilityPeriodExpense[key])
      }
    }
    try {
      await $fetch(`${this.API_PATH}/work-disability-period-expenses`, {
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

  async update(workDisabilityPeriodExpense: WorkDisabilityPeriodExpenseInterface, file: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    const formData = new FormData()
    formData.append('workDisabilityPeriodExpenseFile', file)
    for (const key in workDisabilityPeriodExpense) {
      if (workDisabilityPeriodExpense.hasOwnProperty(key)) {
        if (workDisabilityPeriodExpense[key] === undefined || workDisabilityPeriodExpense[key] === 'null') {
          workDisabilityPeriodExpense[key] = ''
        }
        formData.append(key, workDisabilityPeriodExpense[key])
      }
    }
    try {
      await $fetch(
        `${this.API_PATH}/work-disability-period-expenses/${workDisabilityPeriodExpense.workDisabilityPeriodExpenseId}`,
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

  async delete(workDisabilityPeriodExpense: WorkDisabilityPeriodExpenseInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(
      `${this.API_PATH}/work-disability-period-expenses/${workDisabilityPeriodExpense.workDisabilityPeriodExpenseId}`,
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

  async show(workDisabilityPeriodExpenseId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/work-disability-period-expenses/${workDisabilityPeriodExpenseId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const workDisabilityPeriodExpense =
      responseRequest.status === 200 ? responseRequest._data.data.workDisabilityPeriodExpense : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          workDisabilityPeriodExpense: workDisabilityPeriodExpense,
        },
      },
    };
  }
}
