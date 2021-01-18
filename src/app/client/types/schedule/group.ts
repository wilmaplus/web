import {Teacher} from "./teacher";
import {Room} from "./room";

export interface Group {
  id: number,
  scheduleId: number,
  shortCode: string|null,
  codeName: string|null,
  name: string|null,
  class: string|null,
  teachers: Teacher[],
  rooms: Room[]
}
