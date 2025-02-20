import type { PilotInterface } from "./PilotInterface";
import Aircraft from '../../../../API-SAE/app/models/aircraft';
import type { AircraftPropertyInterface } from "./AircraftPropertyInterface";
import type { ReservationInterface } from "./ReservationInterface";

export interface AircraftInterface {
    aircraftId: number | null;
    aircraftRegistrationNumber: string;
    aircraftSerialNumber: string;
    airportId: number | null;
    aircraftPropertiesId: number | null;
    aircraftOperatorId: number | null;
    aircraftActive: number;
    aircraftCreatedAt: Date | string | null;
    aircraftUpdatedAt: Date | string | null;
    aircraftDeletedAt: Date | string | null;
    aircraftProperty: AircraftPropertyInterface | null;
    reservations: ReservationInterface[];
    pilots: PilotInterface[];
}
