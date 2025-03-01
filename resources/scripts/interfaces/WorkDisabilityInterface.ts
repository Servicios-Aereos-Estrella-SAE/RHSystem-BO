import type { InsuranceCoverageTypeInterface } from "./InsuranceCoverageTypeInterface"
import type { WorkDisabilityPeriodInterface } from "./WorkDisabilityPeriodInterface"

export interface WorkDisabilityInterface {
  workDisabilityId: number
  workDisabilityUuid: string
  employeeId: number
  insuranceCoverageTypeId: number
  workDisabilityCreatedAt?: string,
  workDisabilityUpdatedAt?: string,
  deletedAt?: string,
  workDisabilityPeriods?: [WorkDisabilityPeriodInterface]
  insuranceCoverageType?: InsuranceCoverageTypeInterface
  }
  