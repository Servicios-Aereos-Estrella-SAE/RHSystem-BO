import type { AircraftInterface } from "./AircraftInterface";
import type { MaintenanceUrgencyLevelInterface } from "./MaintenanceUrgencyLevelInterface";
import type { AircraftMaintenanceStatusInterface } from "./AircraftMaintenanceStatusInterface";

export interface AircraftMaintenanceInterface {
  aircraftMaintenanceId: number | null;
  aircraftId: number;
  maintenanceTypeId: number;
  aircraftMaintenanceStartDate: Date | string;
  aircraftMaintenanceEndDate: Date | string;
  maintenanceUrgencyLevelId: number;
  aircraftMaintenanceStatusId: number;
  aircraftMaintenanceNotes: string | null;
  aircraftMaintenanceCreatedAt: Date | string | null;
  aircraftMaintenanceUpdatedAt: Date | string | null;
  aircraftMaintenanceDeletedAt: Date | string | null;
  aircraft: AircraftInterface | null;
  aircraftMaintenanceUrgencyLevel: MaintenanceUrgencyLevelInterface | null;
  aircraftMaintenanceStatus: AircraftMaintenanceStatusInterface | null;
}
