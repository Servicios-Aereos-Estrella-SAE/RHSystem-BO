import { DateTime } from 'luxon'

interface BusinessUnitInterface {
  businessUnitId: number
  businessUnitName: string
  businessUnitSlug: string
  businessUnitLegalName: string
  businessUnitActive: number
  businessUnitCreatedAt: DateTime | null
  businessUnitUpdatedAt: DateTime | null
  businessUnitDeletedAt: DateTime | null
}

export type { BusinessUnitInterface }
