export interface AircraftPropertyInterface {
    aircraftPropertiesHourlyRate: number;
    aircraftPropertiesLandingCostBase: number;
    aircraftPropertiesLandingCostInternational: number;
    aircraftPropertiesOvernightStayLocal: number;
    aircraftPropertiesFuelSurcharge: number;
    aircraftPropertiesDescription: string;
    aircraftPropertyBanner: any;
    aircraftPropertiesId: number | null;
    aircraftPropertiesName: string;
    aircraftClassId: number | null;
    aircraftPropertiesPax: number;
    aircraftPropertiesSpeed: number;
    aircraftPropertiesMaxKg: number;
    aircraftPropertiesAutonomy: number;
    aircraftPropertiesAutonomyHours: number;
    aircraftPropertiesLandingCostNational: number;
    aircraftPropertiesOvernightStayInternational: number;
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    deletedAt: Date | string | null;
  }
  