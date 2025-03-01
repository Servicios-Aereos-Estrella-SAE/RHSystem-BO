import type { AircraftMaintenanceInterface } from "./AircraftMaintenanceInterface";
import type { MaintenanceExpenseCategoryInterface } from "./MaintenanceExpenseCategoryInterface";

export interface MaintenanceExpenseInterface {
  [key: string]: any;
  maintenanceExpenseId: number | null;
  maintenanceExpenseCategoryId: number;
  aircraftMaintenanceId: number;
  maintenanceExpenseAmount: number;
  maintenanceExpenseTicket: string | null;
  maintenanceExpenseTrackingNumber: string | null;
  maintenanceExpenseInternalFolio: string | null;
  maintenanceExpenseCreatedAt: Date | string | null;
  maintenanceExpenseUpdatedAt: Date | string | null;
  maintenanceExpenseDeletedAt: Date | string | null;
  maintenanceExpenseCategory: MaintenanceExpenseCategoryInterface | null;
  AircraftMaintenance: AircraftMaintenanceInterface | null;
}
