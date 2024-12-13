export interface AircraftClassInterface {
    aircraftClassId: number | null;
    aircraftClassName: string;
    aircraftClassBanner?: any;
    aircraftClassLongDescription?: string;
    aircraftClassShortDescription?: string;
    aircraftClassSlug?: string;
    aircraftClassStatus: 0 | 1;
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    deletedAt: Date | string | null;
  }
  