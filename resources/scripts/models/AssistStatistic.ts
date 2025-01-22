import { type AssistStatisticInterface } from "../interfaces/AssistStatisticInterface"

export default class AssistStatistic {
  onTimePercentage: number
  onTolerancePercentage: number
  onDelayPercentage: number
  onFaultPercentage: number
  assists: number
  tolerances: number
  delays: number
  earlyOuts: number
  faults: number
  totalAvailable: number
  onEarlyOutPercentage: number

  constructor () {
    this.onTimePercentage = 0
    this.onTolerancePercentage = 0
    this.onDelayPercentage = 0
    this.onFaultPercentage = 0
    this.assists = 0
    this.tolerances = 0
    this.delays = 0
    this.earlyOuts = 0
    this.faults = 0
    this.totalAvailable = 0
    this.onEarlyOutPercentage = 0
  }

  toModelObject (): AssistStatisticInterface {
    return {
      onTimePercentage: this.onTimePercentage,
      onTolerancePercentage: this.onTolerancePercentage,
      onDelayPercentage: this.onDelayPercentage,
      onFaultPercentage: this.onFaultPercentage,
      assists: this.assists,
      tolerances: this.tolerances,
      delays: this.delays,
      earlyOuts: this.earlyOuts,
      faults: this.faults,
      totalAvailable: this.totalAvailable,
      onEarlyOutPercentage: this.onEarlyOutPercentage
    }
  }
}
