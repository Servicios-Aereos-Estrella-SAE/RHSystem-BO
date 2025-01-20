import type { ReservationLegInterface } from "../interfaces/ReservationLegInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";

export default class ReservationLegService {
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

  async store(reservationLeg: ReservationLegInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-legs`, {
        headers,
        method: 'POST',
        body: JSON.stringify(reservationLeg),
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async update(reservationLeg: ReservationLegInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-legs/${reservationLeg.id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(reservationLeg),
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async delete(reservationLegId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservation-legs/${reservationLegId}`, {
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