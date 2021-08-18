import {Component, Input} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Message} from "../../../client/types/wilma_api/message";
import * as moment from 'moment';
import {Md5} from 'ts-md5/dist/md5';


@Component({
  selector: 'wilmaplus-message',
  templateUrl: './message-element.component.html',
  styleUrls: ['./message-element.component.scss']
})

export class MessageElement extends WilmaPlusAppComponent {

  @Input()
  message: Message | undefined

  @Input()
  userId: number = 0
  @Input()
  type: number = 0
  langTranslate: TranslateService

  senderName: string = ""

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.langTranslate = translate;
  }

  getMessageName() {
    if (this.message === undefined)
      return "";
    return this.message.Subject;
  }

  async getMessageSenderName() {
    if (this.message === undefined)
      return "";
    // TODO cannot implement without fetching recipients list for every message. Leave this to be implemented, when offline messages would be a thing
    /*
    if (!this.message.SenderGuardianName && this.message.SenderId == this.userId && this.message.SenderType == this.type && this.message.Folder !== Folder.sent) {
      let lastReplySender = this.message.Recipients.length > 2 ? this.message.Recipients[0] : (this.message.Recipients[0])+" "+(await this.langTranslate.get('other_recipients_text', {others: this.message.RecipientCount-1}).toPromise())
      if (this.message.ReplyList) {
        let reply = this.message.ReplyList[this.message.ReplyList.length-1];
        if (reply.SenderId === this.type && reply.SenderType === this.type)
           lastReplySender = this.message.Recipients.length == 1 ? reply.Sender : (reply.Sender)+" "+(await this.langTranslate.get('other_recipients_text', {others: this.message.RecipientCount-1}).toPromise())
        else
           lastReplySender = this.message.Recipients.length > 2 ? reply.Sender : (reply.Sender)+" "+(await this.langTranslate.get('other_recipients_text', {others: this.message.RecipientCount-1}).toPromise())
        return lastReplySender;
      }
    }*/
    return this.message.SenderGuardianName || this.message.Sender;
  }

  getMessageURL() {
    return '/messages/'+this.message?.Id;
  }

  unreadMessage() {
    if (this.message === undefined)
      return false;
    return this.message.Status == 1;
  }

  getConversationCount() {
    if (this.message === undefined)
      return "";
    return this.message.Replies;
  }

  hashCode(content: string) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = content.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private static getContrastColor(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getLetterColor() {
    let colorRGB = MessageElement.getContrastColor(this.getColorCode());
    if (colorRGB != null) {
      let sum = (colorRGB.r*299 + colorRGB.g*587+colorRGB.b*114)/1000;
      return sum >= 128 ? "#000" : "#fff";
    } else {
      return "#fff";
    }
  }

  messageSenderToMD5() {
    if (this.message === undefined)
      return ""
    let id = this.message.SenderId.toString();
    // TODO cannot implement without fetching recipients list for every message. Leave this to be implemented, when offline messages would be a thing
    /*
    if (!this.message.SenderGuardianName && this.message.SenderId == this.userId && this.message.SenderType == this.type && this.message.Folder !== Folder.sent) {
      id = this.message.Recipients[0];
      if (this.message.ReplyList) {
        id = this.message.ReplyList[this.message.ReplyList.length-1].SenderId.toString();
      }
    }*/
    return new Md5().appendStr(id).end(false).toString();
  }

  intToRGB(number: number) {
    return "#"+((number)>>>0).toString(16).slice(-6);
  }

  getColorCode() {
    return this.intToRGB(this.hashCode(this.messageSenderToMD5()));
  }

  getMessageTimeStamp() {
    if (this.message === undefined)
      return ""
    let now = moment();
    let sentDate = moment(this.message.TimeStamp)
    if (now.dayOfYear() == sentDate.dayOfYear() && now.year() == sentDate.year()) {
      return sentDate.format("HH:mm")
    } else if (now.week() == sentDate.week() && now.year() == sentDate.year()) {
      return sentDate.format("dddd");
    } else {
      return sentDate.format("DD.MM.yyyy HH:mm");
    }
  }

  ngOnInit() {
    this.getMessageSenderName().then(value => {
      console.log(value);
      this.senderName = value;
    })
  }
}
