import type { AssistDayInterface } from "./AssistDayInterface"
import type { AssistStatisticInterface } from "./AssistStatisticInterface"
import type { EmployeeInterface } from "./EmployeeInterface"

interface EmployeeAssistStatisticInterface {
  employee: EmployeeInterface,
  assistStatistics: AssistStatisticInterface,
  assistStatisticsTemp?: AssistStatisticInterface,
  calendar: AssistDayInterface[]
}

export type { EmployeeAssistStatisticInterface }
