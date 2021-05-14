import {Component, ElementRef, Input, Renderer2, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {Reply} from "../../../client/types/wilma_api/message";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Md5} from 'ts-md5/dist/md5';
import {Renderer} from "@angular/compiler-cli/ngcc/src/rendering/renderer";
import * as moment from "moment";
import {reworkMessageHTML} from "../utils";


@Component({
  selector: 'message-chat-bubble-received',
  templateUrl: './bubble-received.html',
  styleUrls: ['./bubble-received.scss']
})

export class ChatBubbleReceived extends WilmaPlusAppComponent {
  @Input("reply")
  reply: Reply|null = null;

  @ViewChild('msgContent', { static: true }) content: ElementRef | undefined;


  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private renderer:Renderer2) {
    super(snackBar, router, titleService, translate, bottomSheet);
    // @ts-ignore
  }


  hashCode(content: string) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = content.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  senderToMD5() {
    if (this.reply === undefined)
      return ""
    return new Md5().appendStr(String(this.reply?.SenderId)).end(false).toString();
  }

  getSenderColor() {
    return this.intToRGB(this.hashCode(this.senderToMD5()));
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
    let colorRGB = ChatBubbleReceived.getContrastColor(this.getSenderColor());
    if (colorRGB != null) {
      let sum = (colorRGB.r*299 + colorRGB.g*587+colorRGB.b*114)/1000;
      return sum >= 128 ? "#000" : "#fff";
    } else {
      return "#fff";
    }
  }

  getSenderLetter() {
    return this.reply?.Sender?.substr(0,1).toUpperCase();
  }

  intToRGB(number: number) {
    return "#"+((number)>>>0).toString(16).slice(-6);
  }

  ngOnInit() {
    this.applyContent();
  }

  applyContent() {
    this.content?.nativeElement.insertAdjacentHTML('beforeend', reworkMessageHTML(this.reply?.ContentHtml));
  }

  getMessageTimeStamp() {
    if (this.reply === undefined)
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
}
