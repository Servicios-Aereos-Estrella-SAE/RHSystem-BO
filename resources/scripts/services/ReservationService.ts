import type { ReservationInterface } from "../interfaces/ReservationInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";

export default class ReservationService {
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

  /**
   * Obtiene todas las reservas.
   */
  async getFilterList(searchText: string, page: number = 1, limit: number = 999999999) {
    const headers = { ...this.GENERAL_HEADERS };
    let responseRequest: any = null;
      await $fetch(`${this.API_PATH}/reservations`, {
        headers,
        query: {
          search: searchText,
          page,
          limit,
        },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
    })
    return responseRequest;
  }

  async show(reservationId: number) {
    const headers = { ...this.GENERAL_HEADERS };
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/reservations/${reservationId}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
      const reservation = responseRequest.status === 200 ? responseRequest.data.reservation : null;
      return {
          status: responseRequest.status,
          _data: {
            data: {
              reservation,
            }
          }
        }
    } catch (error) {
    }
    return responseRequest;
  }

  async store(reservation: ReservationInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservations`, {
        headers,
        method: 'POST',
        body: reservation,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async update(reservation: ReservationInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservations/${reservation.reservationId}`, {
        headers,
        method: 'PUT',
        body: reservation,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  async delete(reservationId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    try {
      await $fetch(`${this.API_PATH}/reservations/${reservationId}`, {
        headers,
        method: 'DELETE',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest;
  }

  isValidInformationReservation(reservation: ReservationInterface): boolean {
    if (!reservation.customerId) {
      return false;
    }
    if (!reservation.aircraftId) {
      return false;
    }
    if (!reservation.pilotSicId) {
      return false;
    }
    if (!reservation.pilotPicId) {
      return false;
    }
    if (!reservation.flightAttendantId) {
      return false;
    }
    // valid information reservationLegs
    if (!reservation.reservationLegs || reservation.reservationLegs.length === 0) {
      return false;
    }
    if (!reservation.reservationNotes || reservation.reservationNotes.length === 0) {
      return false;
    }
    // validate reservationLegs data with mapper
    let validLegData = true
    for (const reservationLeg of reservation.reservationLegs) {
      if (!reservationLeg.airportDepartureId) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.airportDestinationId) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.reservationLegDepartureTime) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.reservationLegArriveTime) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.reservationLegDepartureDate) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.reservationLegArriveDate) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.reservationLegPax) {
        validLegData = false;
        break;
      }
      if(!reservationLeg.reservationLegDistanceMn || reservationLeg.reservationLegDistanceMn <= 0) {
        validLegData = false;
        break;
      }
    };
    return validLegData;
  }
}
