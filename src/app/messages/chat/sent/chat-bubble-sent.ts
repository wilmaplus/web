import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {Reply, SendStatus} from "../../../client/types/wilma_api/message";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Md5} from 'ts-md5/dist/md5';
import * as moment from "moment";


@Component({
  selector: 'message-chat-bubble-sent',
  templateUrl: './bubble-sent.html',
  styleUrls: ['./bubble-sent.scss']
})

export class ChatBubbleSent extends WilmaPlusAppComponent {
  @Input("reply")
  reply: Reply|null = null;

  @ViewChild('msgContent', { static: true }) content: ElementRef | undefined;


  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet) {
    super(snackBar, router, titleService, translate, bottomSheet);
  }


  hashCode(content: string) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = content.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  getMessageTimeStamp() {
    if (this.reply === undefined || this.getStatus() !== SendStatus.sent)
      return ""
    let now = moment();
    let sentDate = moment(this.reply?.TimeStamp)
    if (now.dayOfYear() == sentDate.dayOfYear() && now.year() == sentDate.year()) {
      return sentDate.format("HH:mm")
    } else if (now.week() == sentDate.week() && now.year() == sentDate.year()) {
      return sentDate.format("dddd");
    } else {
      return sentDate.format("DD.MM.yyyy");
    }
  }

  senderToMD5() {
    if (this.reply === undefined)
      return ""
    return new Md5().appendStr(String(this.reply?.SenderId)).end(false).toString();
  }

  getStatus() {
    if (this.reply?.SendStatus == undefined) {
      return SendStatus.sent;
    } else
      return this.reply.SendStatus;
  }

  intToRGB(number: number) {
    return "#"+((number)>>>0).toString(16).slice(-6);
  }

  ngOnInit() {
    this.applyContent();
  }

  applyContent() {
    // TODO replace this dangerous operation with something else!
    this.content?.nativeElement.insertAdjacentHTML('beforeend', this.reply?.ContentHtml);
  }
}
