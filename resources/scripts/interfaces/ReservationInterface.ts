import type { AircraftInterface } from "./AircraftInterface";
import type { CustomerInterface } from "./CustomerInterface";
import type { FlightAttendantInterface } from "./FlightAttendantInterface";
import type { PilotInterface } from "./PilotInterface";
import type { ReservationLegInterface } from "./ReservationLegInterface";
import type { ReservationNoteInterface } from "./ReservationNoteInterface";

interface ReservationInterface {
  [key: string]: any;
  reservationId: number | null;
  customerId: number | null;
  aircraftId: number | null;
  pilotSicId: number | null;
  pilotPicId: number | null;
  flightAttendantId: number | null;
  reservationSubtotal: number;
  reservationTaxFactor: number | null;
  reservationTax: number;
  reservationTotal: number;
  reservationCreatedAt: Date | string;
  reservationUpdatedAt: Date | string | null;
  reservationDeletedAt: Date | string | null;

  // Define las propiedades de las relaciones
  customer?: CustomerInterface;
  aircraft?: AircraftInterface;
  pilotSic?: PilotInterface;
  pilotPic?: PilotInterface;
  flightAttendant?: FlightAttendantInterface;
  reservationLegs?: ReservationLegInterface[];
  reservationNotes?: ReservationNoteInterface[];
}

export type { ReservationInterface };

