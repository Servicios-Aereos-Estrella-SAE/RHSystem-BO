import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { ExceptionRequestInterface } from "../interfaces/ExceptionRequestInterface";
import type { ShiftExceptionRequestInterface } from "../interfaces/ShiftExceptionRequestInterface";

export default class ExceptionRequestService {
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

  async getFilteredList(filters: {
    search?: string;
    departmentId?: any;
    positionId?: any;
    status?: string;
    employeeName?: string;
    page: number;
    limit: number;
  }) {
    const query = {
      searchText: filters.search || "",
      departmentId: filters.departmentId,
      positionId: filters.positionId,
      status: filters.status,
      employeeName: filters.employeeName,
      page: filters.page,
      limit: filters.limit,
    };

    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined)
    );

    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/exception-requests/all`, {
      headers,
      query: cleanQuery,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });

    const list =
      responseRequest?.status === 200 ? responseRequest._data.data : [];
    return list;
  }

  async getByEmployeeException(employeeId: number) {
    const query = { employeeId: employeeId };
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/exception-requests`, {
      headers,
      query: query,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });

    const list =
      responseRequest.status === 200 ? responseRequest._data.data.data : [];
    return list;
  }

  async updateStatus(exceptionRequest: ExceptionRequestInterface, status: string, description?: string) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    try {
      await $fetch(
        `${this.API_PATH}/exception-requests/${exceptionRequest.exceptionRequestId}/status`,
        {
          headers,
          method: "POST",
          body: { status: status, description: description },
          onResponse({ response }) {
            responseRequest = response;
          },
          onRequestError({ response }) {
            responseRequest = response;
          },
        }
      );
    } catch (error) {
      console.error("Error updating exception request", error);
    }
    return responseRequest;
  }

  async show(exceptionRequestId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/exception-requests/${exceptionRequestId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const exceptionRequest =
      responseRequest.status === 200 ? responseRequest._data.data : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          exceptionRequest: exceptionRequest,
        },
      },
    };
  }

  async store(exceptionRequest: ExceptionRequestInterface, role?: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    try {
      await $fetch(`${this.API_PATH}/exception-requests`, {
        headers,
        method: "POST",
        body: { ...exceptionRequest, ...(role && { role }) },
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

  async update(exceptionRequest: ExceptionRequestInterface, role?: any) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    try {
      await $fetch(
        `${this.API_PATH}/exception-requests/${exceptionRequest.exceptionRequestId}`,
        {
          headers,
          method: "PUT",
          body: { ...exceptionRequest, ...(role && { role }) },
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

  async delete(exceptionRequest: ExceptionRequestInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(
      `${this.API_PATH}/exception-requests/${exceptionRequest.exceptionRequestId}`,
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

  validateInfo(exceptionRequest: ExceptionRequestInterface): boolean {
    if (!exceptionRequest.requestedDate) {
      console.error("Wrong date");
      return false;
    }
    if (!exceptionRequest.exceptionRequestDescription) {
      console.error("Wrong description");
      return false;
    }
    if (!exceptionRequest.exceptionTypeId) {
      console.error("Wrong type id");
      return false;
    }
    return true;
  }
}
