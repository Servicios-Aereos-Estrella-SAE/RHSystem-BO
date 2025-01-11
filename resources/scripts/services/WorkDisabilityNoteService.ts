import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { WorkDisabilityNoteInterface } from "../interfaces/WorkDisabilityNoteInterface";

export default class WorkDisabilityNoteService {
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

  async store(workDisabilityNote: WorkDisabilityNoteInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    
    try {
      await $fetch(`${this.API_PATH}/work-disability-notes`, {
        headers,
        method: "POST",
        body: workDisabilityNote,
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

  async update(workDisabilityNote: WorkDisabilityNoteInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
   
    try {
      await $fetch(
        `${this.API_PATH}/work-disability-notes/${workDisabilityNote.workDisabilityNoteId}`,
        {
          headers,
          method: "PUT",
          body: workDisabilityNote,
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

  async delete(workDisabilityNote: WorkDisabilityNoteInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(
      `${this.API_PATH}/work-disability-notes/${workDisabilityNote.workDisabilityNoteId}`,
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

  async show(workDisabilityNoteId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/work-disability-notes/${workDisabilityNoteId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const workDisabilityNote =
      responseRequest.status === 200 ? responseRequest._data.data.workDisabilityNote : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          workDisabilityNote: workDisabilityNote,
        },
      },
    };
  }
}
