// interfaces/AircraftOperatorInterface.ts
export interface AircraftOperatorInterface {
  [key: string]: any
  aircraftOperatorId: number | null
  aircraftOperatorName: string
  aircraftOperatorFiscalName: string | null
  aircraftOperatorImage: string | null
  aircraftOperatorSlug: string
  aircraftOperatorActive: number,
  aircraftOperatorCreatedAt: Date
  aircraftOperatorUpdatedAt: Date | null
  aircraftOperatorDeletedAt: Date | null
}