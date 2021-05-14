import {ApiResponse} from "./base";
import {Message} from "./wilma_api/message";

export interface MessagesResponse extends ApiResponse {
  messages: Message[];
}

export interface MessageResponse extends ApiResponse {
  message: Message
}
