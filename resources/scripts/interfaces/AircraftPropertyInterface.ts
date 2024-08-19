export interface AircraftPropertyInterface {
    aircraftPropertiesHourlyRate: any;
    aircraftPropertiesLandingCostBase: any;
    aircraftPropertiesLandingCostInternational: any;
    aircraftPropertiesOvernightStayLocal: any;
    aircraftPropertiesFuelSurcharge: any;
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
  