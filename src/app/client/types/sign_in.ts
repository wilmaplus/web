import {ApiResponse} from "./base";
import {Homepage} from "./wilma_api/homepage";

export interface SignInResponse extends ApiResponse {
  response: Homepage;
  session: string;
}

export interface OTPResponse extends ApiResponse {
  otpToken: string;
}
