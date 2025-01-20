import type { ReservationInterface } from "./ReservationInterface";

interface ReservationNoteInterface {
  [key: string]: any;

  reservationNoteId: number; // Identificador único de la nota
  reservationId: number; // Relación con la reserva
  reservationNoteContent: string; // Contenido de la nota
  reservationNoteCreatedAt: Date | string | null; // Fecha de creación (Date o string)
  reservationNoteUpdatedAt: Date | string | null; // Fecha de actualización (opcional)
  deletedAt?: Date | string | null; // Fecha de eliminación para SoftDeletes
  reservation?: ReservationInterface; // Relación opcional con el modelo Reservation
}

export type { ReservationNoteInterface };
