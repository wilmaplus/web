import {Component, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../wilma-plus-app.component";
import {GlobalConfig} from "../config/global";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {AuthApi} from "../authapi/auth_api";
import {Router} from "@angular/router";
import { version } from '../../../package.json';
import {AccountModel, IAccountModel} from "../authapi/accounts_db/model";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AccountSelector} from "./account_selector/bottomsheet";
import {Role} from "../client/types/wilma_api/homepage";
import {AccountTypes} from "../authapi/account_types";
import {IRoleModel, RoleModel} from "../authapi/roles_db/model";
import {MiscUtils} from "../utils/misc";
import {MatSidenav} from "@angular/material/sidenav";
import { ActivatedRoute } from '@angular/router';

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
  private router: Router;
  @ViewChild('drawer', {static: true}) sidenav: MatSidenav | undefined;
  pages = [
    {name: 'homepage', path: '/home', icon: 'home'},
    {name: 'settings', path: '/settings', icon: 'settings'}
  ]

  constructor(snackBar: MatSnackBar, _bottomSheet: MatBottomSheet, router: Router, titleService: Title, translate: TranslateService, private authApi: AuthApi, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) {
    super(snackBar, router, titleService, translate, _bottomSheet);
    console.log(version);
    this.router = router;
    this.init(authApi, router);
  }

  init(authApi: AuthApi, router: Router) {
    authApi.accountsExist(exists => {
      if (!exists) {
        router.navigate(['/login']);
      } else {
        this.refreshUI(authApi, router);
      }
    }, error => {
      console.log(error);
    });
  }

  private refreshUI(authApi: AuthApi, router: Router) {
    authApi.getSelectedAccount(account => {
      if (account !== undefined) {
        this.account = account;
        if (account.type == AccountTypes.ACCOUNT) {
          if (account.selectedRole !== null) {
            this.authApi.getRole(account.selectedRole, (role) => {
              if (role !== undefined) {
                this.updateUIWithRole(role);
                this.startupUI();
              } else {
                this.openForcedRoleSelectionDialog();
              }
            }, error => {
              this.openError(error, () => {this.refreshUI(authApi, router)});
            })
          } else {
            this.authApi.getRolesOfAccount(account, (roles: RoleModel[]) => {
              if (roles.length > 0) {
                this.setRole(roles[0]);
              } else {
                this.openForcedRoleSelectionDialog();
              }
            }, error => {
              this.openError(error, () => {this.refreshUI(authApi, router)});
            });
          }
        } else {
          this.updateUIWithAccount(account);
          this.startupUI();
        }
      } else {
        // Got no account, redirecting to login page
        router.navigate(['/login']);
      }
    }, (error) => {this.openError(error, () => {this.init(authApi, router)})});
  }

  private startupUI() {
    if (this.router.url === "/")
      this.navigateToPage('home');
  }

  navigateToPage(pageName: string, closeDrawer: boolean=false) {
    if (closeDrawer)
      this.sidenav?.close();
    this.router.navigate([pageName], {relativeTo: this.activatedRoute});
  }

  private openForcedRoleSelectionDialog() {
    let onRoleSelect = (role:Role) => {
      if (this.account !== null) {
        this.setRole(RoleModel.fromRole(this.account.id, role));
        this.refreshUI(this.authApi, this.router);
      }
    };
    this._bottomSheet.open(AccountSelector, {data: {onRoleSelect:onRoleSelect, title: 'select_role', addAccounts: false, onlySelectRole: true}, panelClass: 'removePadding', disableClose: true});
  }

  private updateUIWithAccount(account: IAccountModel) {
    // Setting UI details for account
    this.ui.name = account?.name;
    this.ui.school = account.school;
    this.ui.profileImage = account.photo;
  }

  private updateUIWithRole(role: RoleModel) {
    // Setting UI details for role
    this.ui.name = role?.Name;
    this.ui.school = role.School;
    this.ui.profileImage = role.Photo;
  }

  private setRole(role: RoleModel) {
    this.authApi.getSelectedAccount((account: IAccountModel|undefined) => {
      if (account !== undefined) {
        let accountModel = AccountModel.fromRawModel(account);
        accountModel.selectedRole = role.id;
        this.authApi.updateAccount(accountModel, () => {
          this.refreshUI(this.authApi, this.router);
        }, error => {
          this.openError(error, () => {this.openForcedRoleSelectionDialog();})
        })
      } else {
        this.router.navigate(['/login']);
      }
    }, error => {
      this.openError(error, () => {this.openForcedRoleSelectionDialog();})
    });
  }

  getBase64Image(imageString: string) {
    return MiscUtils.getBase64Image(imageString, this._sanitizer);
  }

  openSelectorDialog() {
    let onAccountSelect = (account:IAccountModel) => {
      this.authApi.selectAccount(account);
      this.account = AccountModel.fromRawModel(account);
      this.sidenav?.toggle(false);
      this.refreshUI(this.authApi, this.router);
    };
    let onRoleSelect = (role:Role) => {
      if (this.account !== null) {
        this.setRole(RoleModel.fromRole(this.account.id, role));
        this.sidenav?.toggle(false);
        this.refreshUI(this.authApi, this.router);
      }
    };
    this._bottomSheet.open(AccountSelector, {data: {onAccountSelect: onAccountSelect, onRoleSelect:onRoleSelect, title: null, addAccounts: true}, panelClass: 'removePadding'});
  }
}
