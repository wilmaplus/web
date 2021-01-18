import {ApiResponse} from "./base";
import {ScheduleDay} from "./schedule/schedule_day";
import {Term} from "./schedule/terms/term";

export interface ScheduleResponse extends ApiResponse {
  schedule: ScheduleDay[];
  terms: Term[];
}
