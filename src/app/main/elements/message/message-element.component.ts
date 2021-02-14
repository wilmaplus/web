import {Component, Input} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Message} from "../../../client/types/wilma_api/message";

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
    return this.message.Sender;
  }
}
