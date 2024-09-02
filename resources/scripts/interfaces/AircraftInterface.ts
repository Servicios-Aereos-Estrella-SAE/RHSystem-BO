export interface AircraftInterface {
    aircraftId: number | null;
    aircraftRegistrationNumber: string;
    aircraftSerialNumber: string;
    airportId: number | null;
    aircraftPropertiesId: number | null;
    aircraftActive: number;
    aircraftCreatedAt: Date | string | null;
    aircraftUpdatedAt: Date | string | null;
    aircraftDeletedAt: Date | string | null;
}
