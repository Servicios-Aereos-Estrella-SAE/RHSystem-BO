import type { DateTime } from "luxon";
import type { AircraftInterface } from "./AircraftInterface";
import type { AircraftMaintenanceInterface } from "./AircraftMaintenanceInterface";

export interface CalendarDayReservation {
  date: DateTime,
  day: string,
  formattedDate: string,
  aircraft: AircraftInterface,
  aircraftMaintenances: AircraftMaintenanceInterface[]
}
