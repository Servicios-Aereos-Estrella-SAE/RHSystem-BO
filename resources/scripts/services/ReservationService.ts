import type { ReservationInterface } from "../interfaces/ReservationInterface";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface";
import type { ToastServiceMethods } from "primevue/toastservice";
import type { ReservationLegInterface } from "../interfaces/ReservationLegInterface";

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

  async isValidInformationReservation(reservation: ReservationInterface, toast: ToastServiceMethods): Promise<boolean> {
    if (!reservation.customerId) {
      toast.add({ severity: 'warn', summary: '', detail: 'The customer is required.', life: 5000 });
      return false;
    }
    if (!reservation.aircraftId) {
      toast.add({ severity: 'warn', summary: '', detail: 'The aircraft is required.', life: 5000 });
      return false;
    }
    if (!reservation.pilotSicId) {
      return false;
    }
    if (!reservation.pilotPicId) {
      return false;
    }
    if (reservation.pilotSicId === reservation.pilotPicId) {
      toast.add({ severity: 'warn', summary: '', detail: 'The PIC and SIC pilots cannot be the same.', life: 5000 });
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
    for (let i = 0; i < reservation.reservationLegs.length; i++) {
      const reservationLeg: ReservationLegInterface = reservation.reservationLegs[i];
      const legNumber = i + 1; // leg #1, #2, etc.
      const toDateTime = (dateObj: Date, timeString: string) => {
        const d = new Date(dateObj);
        const [hh, mm] = timeString.split(':');
        d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
        return d;
      };
      // get prev leg iterated
      const prevLeg = reservation.reservationLegs[reservation.reservationLegs.indexOf(reservationLeg) - 1];
      if (!reservationLeg.airportDepartureId) {
        validLegData = false;
        break;
      }
      if (!reservationLeg.airportDestinationId) {
        validLegData = false;
        break;
      }
      if (reservationLeg.airportDepartureId === reservationLeg.airportDestinationId) {
        toast.add({ severity: 'warn', summary: '', detail: `Leg #${legNumber}: The departure and destination airports cannot be the same.`, life: 5000 });
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
      // valid if arrival date is less than departure date
      const departureDate = new Date(reservationLeg.reservationLegDepartureDate)
      const arriveDate = new Date(reservationLeg.reservationLegArriveDate)
      if (departureDate > arriveDate) {
        toast.add({
          severity: 'warn',
          summary: '',
          detail: `Leg #${legNumber}: The arrival date cannot be less than the departure date.`,
          life: 5000
        });
        validLegData = false;
        break;
      }
      // if departureDate is equal to arriveDate, and reservationLegDepartureTime is greater than reservationLegArriveTime
      // example values for reservationLegDepartureTime 00:00 and reservationLegArriveTime 23:59
      if (departureDate.getTime() === arriveDate.getTime()) {
        const departureTime = toDateTime(departureDate, reservationLeg.reservationLegDepartureTime as string);
        const arriveTime = toDateTime(arriveDate, reservationLeg.reservationLegArriveTime as string);
        console.log(departureTime, arriveTime)
        if (departureTime >= arriveTime) {
          toast.add({
            severity: 'warn',
            summary: '',
            detail: `Leg #${legNumber}: The arrival time cannot be less than the departure time.`,
            life: 5000
          });
          validLegData = false;
          break;
        }
      }

      if (!reservationLeg.reservationLegPax) {
        validLegData = false;
        break;
      }
      if(!reservationLeg.reservationLegDistanceMn || reservationLeg.reservationLegDistanceMn <= 0) {
        validLegData = false;
        break;
      }

      if (i > 0) {
        const prevLeg = reservation.reservationLegs[i - 1] as ReservationLegInterface;

        // Convirtamos a objeto Date la llegada del leg anterior
        const prevArriveDateObj = new Date(prevLeg.reservationLegArriveDate as Date);
        


        // Obtenemos la fecha/hora de llegada del leg anterior
        const prevArrivalTime = toDateTime(prevArriveDateObj, prevLeg.reservationLegArriveTime as string);

        // Obtenemos la fecha/hora de salida del leg actual
        const currDepartureTime = toDateTime(departureDate, reservationLeg.reservationLegDepartureTime as string);

        if (currDepartureTime < prevArrivalTime) {
          toast.add({
            severity: 'warn',
            summary: '',
            detail: `This leg #${legNumber} departure date and time cannot be before the previous leg #${i} arrival.`,
            life: 10000
          });
          validLegData = false;
          break;
        }
      }

    };
    if (validLegData) {
      // validate reservation legs async with backend
      debugger
      for (let i = 0; i < reservation.reservationLegs.length; i++) {
      const reservationLeg = reservation.reservationLegs[i];
        const responseValidate = await this.validateReservationLegDates(reservationLeg, reservation);
        console.log(responseValidate)
        const reservationConflict = responseValidate.reservation as ReservationInterface | null;
        if (reservationConflict) {
          const contactName = reservationConflict.customer?.person?.personFirstname || '' + reservationConflict.customer?.person?.personLastname || '' + reservationConflict.customer?.person?.personSecondLastname || '';
          validLegData = false;
          toast.add({
            severity: 'warn',
            summary: '',
            detail: `Leg #${i +1}: There is a conflict with the reservation of the customer ${contactName}.`,
            life: 5000
          });
          break;
        }
      }
    }
    console.log(validLegData)
    return validLegData;
  }

  async validateReservationLegDates(reservationLeg: ReservationLegInterface, reservation: ReservationInterface): Promise<any> {
    
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };
    const body = {
      reservationLegDepartureDate: reservationLeg.reservationLegDepartureDate,
      reservationLegDepartureTime: reservationLeg.reservationLegDepartureTime,
      reservationLegArriveDate: reservationLeg.reservationLegArriveDate,
      reservationLegArriveTime: reservationLeg.reservationLegArriveTime,
      aircraftId: reservation.aircraftId,
      reservationId: reservation.reservationId
    }
    try {
      await $fetch(`${this.API_PATH}/reservation-legs/validate`, {
        headers,
        method: 'POST',
        body: body,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      console.log(responseRequest._data)
      return responseRequest._data.data;
    } catch (error) {
    }
    return responseRequest;
  }
}
