import { AssistStatisticInterface } from "../interfaces/AssistStatisticInterface"

export default class AssistStatistic {
  onTimePercentage: number
  onTolerancePercentage: number
  onDelayPercentage: number
  onFaultPercentage: number

  constructor () {
    this.onTimePercentage = 0
    this.onTolerancePercentage = 0
    this.onDelayPercentage = 0
    this.onFaultPercentage = 0
  }

  toModelObject (): AssistStatisticInterface {
    return {
      onTimePercentage: this.onTimePercentage,
      onTolerancePercentage: this.onTolerancePercentage,
      onDelayPercentage: this.onDelayPercentage,
      onFaultPercentage: this.onFaultPercentage,
    }
  }
}
