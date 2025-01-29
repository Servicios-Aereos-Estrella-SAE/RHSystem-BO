import type { ReservationNoteInterface } from "../interfaces/ReservationNoteInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";

export default class ReservationNoteService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface;

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async store(reservationNote: ReservationNoteInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-notes`, {
        headers,
        method: 'POST',
        body: JSON.stringify(reservationNote),
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async update(reservationNote: ReservationNoteInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-notes/${reservationNote.reservationNoteId}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(reservationNote),
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async delete(reservationNoteId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-notes/${reservationNoteId}`, {
        headers,
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }
}