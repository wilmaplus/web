import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../wilma-plus-app.component";
import {GlobalConfig} from "../config/global";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {AuthApi} from "../authapi/auth_api";
import {Router} from "@angular/router";
import { version } from '../../../package.json';
import {IAccountModel} from "../authapi/accounts_db/model";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AccountSelector} from "./account_selector/bottomsheet";
import {Role} from "../client/types/wilma_api/homepage";

class UISettings {
  name: string|null
  school: string|null
  profileImage: string|null


  constructor() {
    this.name = null;
    this.school = null;
    this.profileImage = null;
  }
}

@Component({
  selector: 'wilma-client',
  templateUrl: './client.html',
  styleUrls: ['./client.scss']
})

export class WilmaClient extends WilmaPlusAppComponent {
  pageTitle = new GlobalConfig().app_name
  appName = new GlobalConfig().app_name
  version = version
  ui = new UISettings()
  account: IAccountModel|null = null

  constructor(snackBar: MatSnackBar, _bottomSheet: MatBottomSheet, router: Router, titleService: Title, translate: TranslateService, private authApi: AuthApi) {
    super(snackBar, router, titleService, translate, _bottomSheet);
    console.log(version);
    this.init(authApi, router);
  }

  init(authApi: AuthApi, router: Router) {
    authApi.accountsExist(exists => {
      if (!exists) {
        router.navigate(['/login']);
      } else {
        authApi.getSelectedAccount(account => {
          if (account !== undefined) {
            this.account = account;
            // Setting UI details for account
            this.ui.name = account?.name;
            this.ui.school = account.school;
            this.ui.profileImage = account.photo;
          } else {
            // Got no account, redirecting to login page
            router.navigate(['/login']);
          }
        }, (error) => {this.openError(error, () => {this.init(authApi, router)})})
      }
    }, error => {
      console.log(error);
    });
  }

  openSelectorDialog() {
    let onAccountSelect = (account:IAccountModel) => {
      console.log(account);
    };
    let onRoleSelect = (role:Role) => {
      console.log(role);
    };
    this._bottomSheet.open(AccountSelector, {data: {onAccountSelect: onAccountSelect, onRoleSelect:onRoleSelect, title: null, addAccounts: true}});
  }
}
