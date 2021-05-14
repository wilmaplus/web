
export enum Folder {
  inbox="inbox",
  sent="outbox",
  archive="archive",
  draft="draft"
}

export enum SendStatus {
  sending = "msg_status_sending",
  pending = "msg_status_pending",
  fained = "msg_status_failed",
  sent = "msg_status_sent",
}

export interface Message {
  Id: number
  Subject: string
  TimeStamp: string
  Folder: Folder,
  SenderId: number,
  SenderType: number,
  Sender: string,
  Status: number,
  Replies: number,
  SenderStudentName: string
  SenderPasswdID: number,
  SenderGuardianName: string,
  AllowCollatedReply: boolean,
  AllowForward: boolean,
  RecipientCount: number,
  ReplyList:Reply[],
  Recipients: string[],
  ContentBBCode: string,
  ContentHtml: string
}

export interface Reply {
  Id: number,
  ContentHtml: string,
  TimeStamp: string,
  SenderId: number,
  SenderType: number,
  Sender: string,
  SendStatus: string|undefined
}
