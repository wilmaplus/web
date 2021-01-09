import {ApiResponse} from "./base";

export interface ServerResponse extends ApiResponse {
  servers: object[];
}
