import type { AssistInterface } from "./AssistInterface"

interface AssistDayInterface {
  day: string
  assist: {
    check_in: AssistInterface | null
    check_out: AssistInterface | null
  }
}

export type { AssistDayInterface }
