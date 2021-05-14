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
import has = Reflect.has;

@Component({
  selector: 'wilmaplus-message',
  templateUrl: './message-element.component.html',
  styleUrls: ['./message-element.component.scss']
})

export class MessageElement extends WilmaPlusAppComponent {

  @Input()
  message: Message | undefined

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet) {
    super(snackBar, router, titleService, translate, bottomSheet);
  }

  getMessageName() {
    if (this.message === undefined)
      return "";
    return this.message.Subject;
  }

  getMessageSender() {
    if (this.message === undefined)
      return "";
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
    return new Md5().appendStr(this.message.SenderId.toString()).end(false).toString();
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
}
