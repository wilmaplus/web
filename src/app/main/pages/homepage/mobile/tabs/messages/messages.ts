import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../../../../authapi/auth_api";
import {Message} from "../../../../../../client/types/wilma_api/message";
import {ApiClient} from "../../../../../../client/apiclient";


@Component({
  selector: 'wilmaplus-tab-messages',
  templateUrl: './messages.html',
  styleUrls: ['./messages.scss']
})

export class MessagesTab extends WilmaPlusAppComponent {
  loading = true;
  unreadMessages: Message[] = []
  inboxMessages: Message[] = []

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi, private apiClient: ApiClient) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.authApi.getSelectedAccountWithCorrectUrl(accountModel => {
      if (accountModel !== undefined) {
        this.apiClient.getMessages(accountModel, messages => {
          this.loading = false;
          this.unreadMessages = messages.messages.filter((item: Message) => {return item.Status});
          this.inboxMessages = messages.messages.filter((item: Message) => {return !item.Status});
          if (this.inboxMessages.length > 5) {
            this.inboxMessages = this.inboxMessages.copyWithin(0, 0, 5);
          }
        }, error => {
          this.loading = false;
          console.log(error);
          // Re-login is handled by homepage, so tab is being silent while homepage re-logins.
          if (error.reLogin)
            return;
          this.openError(error, () => {this.loadMessages()});
        })
      } else
        this.loading = false;
    }, error => {
      this.loading = false;
      console.log(error);
      this.openError(error, () => {this.loadMessages()});
    })
  }
}
