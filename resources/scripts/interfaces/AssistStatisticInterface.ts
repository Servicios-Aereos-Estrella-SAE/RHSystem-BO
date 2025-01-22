interface AssistStatisticInterface {
  onTimePercentage: number
  onTolerancePercentage: number
  onDelayPercentage: number
  onEarlyOutPercentage: number
  onFaultPercentage: number
  assists: number
  tolerances: number
  delays: number
  earlyOuts: number
  faults: number
  totalAvailable: number
}

export type { AssistStatisticInterface }
