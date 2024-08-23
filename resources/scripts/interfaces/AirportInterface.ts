export interface AirportInterface {
    airportId: number | null;
    airportType: string;
    airportName: string;
    airportLatitudeDeg: number;
    airportLongitudeDeg: number;
    airportElevationFt: number | null;
    airportDisplayLocationName: string;
    airportIsoCountry: string;
    airportIsoRegion: string;
    airportActive: number;
    airportIcaoCode: string | null;
    airportIataCode: string | null;
    airportCreatedAt: Date | string | null;
    airportUpdatedAt: Date | string | null;
    airportDeletedAt: Date | string | null;
}
