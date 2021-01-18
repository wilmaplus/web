import {Group} from "./group";

export interface Reservation {
  reservationId: number,
  scheduleId: number,
  date: Date|null,
  start: Date|null,
  end: Date|null,
  class: string|null,
  groups: Group[]
}
