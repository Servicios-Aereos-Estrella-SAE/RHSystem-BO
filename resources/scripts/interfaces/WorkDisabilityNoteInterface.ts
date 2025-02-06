import type { UserInterface } from "./UserInterface"

export interface WorkDisabilityNoteInterface {
  workDisabilityNoteId: number
  workDisabilityNoteDescription: string
  workDisabilityId: number
  userId: number
  workDisabilityNoteCreatedAt?: string
  workDisabilityNoteUpdatedAt?: string
  deletedAt?: string

  user?: UserInterface
}
