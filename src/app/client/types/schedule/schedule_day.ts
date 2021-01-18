import {Reservation} from "./reservation";


export interface ScheduleDay {
  date: Date,
  reservations: Reservation[]
}
