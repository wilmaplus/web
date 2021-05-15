import {Component, ElementRef, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../authapi/auth_api";
import {IAccountModel} from "../../authapi/accounts_db/model";
import {Message, Reply, SendStatus} from "../../client/types/wilma_api/message";
import {ApiClient} from "../../client/apiclient";
import {ApiError} from "../../client/types/base";
import {Location} from "@angular/common";
import {Role} from "../../client/types/wilma_api/homepage";
import {AccountTypes} from "../../authapi/account_types";
import * as moment from "moment";


@Component({
  selector: 'message-viewer',
  templateUrl: './messageviewer.html',
  styleUrls: ['./messageviewer.scss']
})

export class MessageViewer extends WilmaPlusAppComponent {
  translateService: TranslateService
  account: IAccountModel|undefined = undefined
  role: Role|undefined = undefined
  messageId: string|null = null
  loading: boolean = true
  message: Message|undefined = undefined
  chat: Reply[] = []
  composeContent: string = '';
  toggled: boolean = false;
  @ViewChild('chatBox', {read: ElementRef}) private chatBox: ElementRef | undefined;

  constructor(snackBar: MatSnackBar, _bottomSheet: MatBottomSheet, router: Router, titleService: Title, translate: TranslateService, private _location: Location, private authApi: AuthApi, private apiClient:ApiClient, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) {
    super(snackBar, router, titleService, translate, _bottomSheet);
    this.translateService = translate;
    this.init(authApi, router);
  }


  validateURL(router: Router) {
    let messageId = this.activatedRoute.snapshot.paramMap.get('id')
    if (messageId && /^\d+$/.test(messageId)) {
      this.messageId = messageId;
      this.loadMessage();
    } else {
      router.navigate(['/home']);
    }
  }


  loadMessage() {
    if (this.account === undefined || this.messageId === null) {
      this.openError(new ApiError("wilmaplus-web-77", "Auth Failure", undefined), () => {this.loadMessage()});
      return;
    }
    this.apiClient.getMessage(this.account, this.messageId, message => {
      this.loading = false;
      this.message = message.message;
      this.setTitle(this.message.Subject);
      this.chat = [{Id: -1, SenderId: this.message.SenderId, ContentHtml: this.message.ContentHtml, Sender: this.message.Sender, SenderType: this.message.SenderType, TimeStamp: this.message.TimeStamp, SendStatus: SendStatus.sent}];
      this.message.ReplyList.map(item => {this.chat.push(item)});
      setTimeout(() => {this.scrollToBottom();}, 300);
    }, error => {
      this.playAudio('message_failure');
      this.openError(error, () => {this.loadMessage()}, false);
    })
  }

  replySenderIsUser(reply: Reply|undefined) {
    if (reply == undefined)
      return false;
    else {
      if (this.role)
        return reply.SenderId == this.role?.PrimusId && reply.SenderType == this.role.Type;
      else
        return reply.SenderId == this.account?.primusId && reply.SenderType == this.account.type;
    }
  }

  init(authApi: AuthApi, router: Router) {
    authApi.accountsExist(exists => {
      if (!exists) {
        router.navigate(['/login']);
      } else {
        authApi.getSelectedAccountWithCorrectUrl(account => {
          this.account = account;
          if (this.account?.type == AccountTypes.ACCOUNT && this.account.selectedRole) {
            authApi.getRole(this.account.selectedRole, role => {
              this.role = role;
              this.validateURL(router);
            }, error => {
              router.navigate(['/login']);
            })
          } else
            this.validateURL(router);
        }, (error) => {this.playAudio('message_failure');this.openError(error, () => {this.init(authApi, router)}, false)});
      }
    }, error => {
      console.log(error);
      router.navigate(['/login']);
    });
  }


  goBack() {
    this._location.back();
  }

  handleSelection(event: any) {
    this.composeContent += event.char;
  }

  sendBtnClick() {
    if (this.composeContent.trim().length > 0 && this.account !== undefined && this.messageId !== null) {
      let uId = this.role?.PrimusId || this.account?.primusId || -1;
      let uType = this.role?.Type || this.account?.type || -1;
      let uName = this.role?.Name || this.account?.name || '';
      let reply = {Id: new Date().getMilliseconds(), SenderId: uId, ContentHtml: this.composeContent, Sender: uName, SenderType: uType, TimeStamp: moment().toISOString(true), SendStatus: SendStatus.sending};
      this.chat.push(reply);
      setTimeout(()=>{this.scrollToBottom()}, 100);
      this.apiClient.collatedReply(this.account, this.messageId, this.composeContent, msg => {
        this.message = msg.message;
        this.chat = [{Id: -1, SenderId: this.message.SenderId, ContentHtml: this.message.ContentHtml, Sender: this.message.Sender, SenderType: this.message.SenderType, TimeStamp: this.message.TimeStamp, SendStatus: SendStatus.sent}];
        this.message.ReplyList.map(item => {this.chat.push(item)});
        this.scrollToBottom();
        this.composeContent = "";
        this.playAudio("message_sent");
      }, err => {
        this.chat[this.chat.length-1].SendStatus = SendStatus.fained;
        this.playAudio("message_failure");
        console.log(err);
      })
    } else {
      // TODO attach
      this.playAudio("message_failure");
      this.openError(new ApiError("wilmaplus-(-1)", "Feature is in WIP!", null), () => {});
    }
  }

  playAudio(name: string) {
    let audio = new Audio();
    audio.src = "../../../assets/media/"+name+".wav";
    audio.load();
    audio.play();
  }

  scrollToBottom(): void {
    if (this.chatBox === undefined)
      return;
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch(err) {console.log(err);}
  }

}
