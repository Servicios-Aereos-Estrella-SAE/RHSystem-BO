import type { AirportInterface } from "./AirportInterface";
import type { ReservationInterface } from "./ReservationInterface";

interface ReservationLegInterface {
  [key: string]: any;

  reservationLegId: number | null;
  reservationId: number | null;
  airportDepartureId: number | null;
  airportDestinationId: number | null;
  reservationLegDepartureTime: Date | string | null;
  reservationLegArriveTime: Date | string | null;
  reservationLegDepartureDate: Date | string | null;
  reservationLegArriveDate: Date | string | null;
  reservationLegCreatedAt: Date | string | null;
  reservationLegUpdatedAt: Date | string | null;
  reservationLegDeletedAt: Date | string | null;
  reservationLegPax: number;
  reservationLegDistanceMn: number | null;
  reservationLegTravelTime: number;

  // Relaciones
  reservation?: ReservationInterface | null;
  airportDeparture?: AirportInterface | null;
  airportDestination?: AirportInterface | null;
}

export type { ReservationLegInterface };
