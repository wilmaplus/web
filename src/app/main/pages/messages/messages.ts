import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../authapi/auth_api";
import {Message} from "../../../client/types/wilma_api/message";
import {AccountTypes} from "../../../authapi/account_types";
import {ApiClient} from "../../../client/apiclient";



@Component({
  selector: 'wilmaplus-messages',
  templateUrl: './messages.html',
  styleUrls: ['./messages.scss']
})

export class Messages extends WilmaPlusAppComponent {
  folders: {name: string, icon: string, messages: Message[]}[] = [
    {name: 'unread', icon: 'email', messages: []},
    {name: 'inbox', icon: 'inbox', messages: []},
    {name: 'sent', icon: 'send', messages: []},
    {name: 'archive', icon: 'archive', messages: []},
    {name: 'drafts', icon: 'drafts', messages: []}
  ]
  loading = true

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi, private apiClient:ApiClient) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.authApi = authApi;
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.authApi.getSelectedAccountWithCorrectUrl(account => {
      if (account !== undefined) {
        this.apiClient.getMessages(account, messages => {
          this.loading = false;
          this.folders[0].messages = messages.messages.filter((item: Message) => {return item.Status});
          this.folders[1].messages = messages.messages.filter((item: Message) => {return item.Folder==='inbox'});
          this.folders[2].messages = messages.messages.filter((item: Message) => {return item.Folder==='outbox'});
          this.folders[3].messages = messages.messages.filter((item: Message) => {return item.Folder==='archive'});
          this.folders[4].messages = messages.messages.filter((item: Message) => {return item.Folder==='draft'});
        }, error => {
          this.loading = false;
          console.log(error);
          // Re-login is handled by homepage, so tab is being silent while homepage re-logins.
          if (error.reLogin)
            return;
          this.openError(error, () => {this.loadMessages()});
        }, 'all');
      } else
        this.loading = false;
    }, (error) => {this.openError(error, () => {this.loadMessages()})});
  }
}
