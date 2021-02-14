
export enum Folder {
  inbox="inbox",
  sent="outbox",
  archive="archive",
  draft="draft"
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
  Sender: string
}
