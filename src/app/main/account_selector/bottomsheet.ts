import {ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {AccountModel, IAccountModel} from "../../authapi/accounts_db/model";
import {Role} from "../../client/types/wilma_api/homepage";
import {AuthApi} from "../../authapi/auth_api";
import {TranslateService} from "@ngx-translate/core";
import {ApiClient} from "../../client/apiclient";
import {ReLoginUtils} from "../../utils/relogin";
import {DomSanitizer} from "@angular/platform-browser";
import {RoleModel} from "../../authapi/roles_db/model";
import {ApiError} from "../../client/types/base";
import {AccountTypes} from "../../authapi/account_types";

@Component({
  selector: 'account-selector',
  templateUrl: './bottomsheet.html',
  styleUrls: ['./bottomsheet.scss']
})

export class AccountSelector {
  title:string = '';
  addAccountsEnabled:boolean = true;
  accounts:IAccountModel[] = []
  roles:Role[] = []
  onAccountSelect: (account: IAccountModel) => void
  onRoleSelect: (role: Role) => void
  loading = true
  selectedAccount:IAccountModel | undefined = undefined
  roleLoadError: ApiError = ApiError.emptyError();
  refreshCallback: () => void = () => {
    this.loading = true;
    this.refreshRoles();
  }

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {onAccountSelect: (account: IAccountModel) => void, onRoleSelect: (role: Role) => void, title: string|null, addAccounts: boolean}, private _bottomSheetRef: MatBottomSheetRef<AccountSelector>, private authApi: AuthApi, private translator:TranslateService, private apiClient:ApiClient, private _bottomSheet: MatBottomSheet, private _sanitizer: DomSanitizer, private chRef: ChangeDetectorRef) {
    this.onAccountSelect = data.onAccountSelect;
    this.onRoleSelect = data.onRoleSelect;
    this.addAccountsEnabled = data.addAccounts;
    this.init(data.title);
  }

  init(title: string|null) {
    this.title = title==null ? 'select_account_or_role' : title;
    this.authApi.getAllAccounts((allAccounts) => {
      this.accounts = allAccounts;
      console.log(allAccounts);
    }, (error) => {
      console.log(error);
    });
    this.authApi.getSelectedAccount((account) => {
      this.selectedAccount = account;
      if (account !== undefined && account.type === AccountTypes.ACCOUNT) {
        this.authApi.rolesSaved(account, (exists) => {
          if (!exists) {
            console.log("fetching homepage");
            this.refreshRoles();
          } else {
            this.loadRolesFromDb(account);
          }
        }, error => {
          this.loading = false;
          this.roleLoadError = error;
          this.chRef.detectChanges();
          console.log(error);
        })
      }
    }, error => {
      console.log(error);
      this.loading = false;
      this.roleLoadError = error;
      this.chRef.detectChanges();
    })
  }

  private refreshRoles() {
    this.authApi.getSelectedAccount((account) => {
      this.selectedAccount = account;
      if (account !== undefined) {
        this.apiClient.getHomepage(account, (homepage) => {
          this.authApi.addOrReplaceRoles(this.authApi.convertApiRoles(account.id, homepage.Roles), () => {
            this.loadRolesFromDb(account);
          }, error => {
            this.loading = false;
            this.roleLoadError = error;
            this.chRef.detectChanges();
            console.log(error);
          })
        }, error => {
          if (error.reLogin) {
            ReLoginUtils.reLogin(this.apiClient, this.authApi, () => {
              this.refreshRoles();
            }, (error) => {
              this.loading = false;
              console.log(error);
              this.roleLoadError = error;
              this.chRef.detectChanges();
            }, null, null);
            return;
          } else {
            console.log(error);
            this.loading = false;
            this.roleLoadError = error;
            this.chRef.detectChanges();
          }
        });
      }
    }, error => {
      this.loading = false;
      this.roleLoadError = error;
      this.chRef.detectChanges();
      console.log(error);
    });

  }

  private loadRolesFromDb(account: IAccountModel) {
    this.authApi.getRolesOfAccount(account, roles => {
      this.roles = roles;
      this.loading = false;
    }, error => {
      this.roleLoadError = error;
      this.chRef.detectChanges();
    })
  }

  private static b64toBlob(b64Data: string, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  getBase64Image(imageString: string) {
    let blob = URL.createObjectURL(AccountSelector.b64toBlob(imageString));
    return this._sanitizer.bypassSecurityTrustUrl(blob);
  }

  addAccount() {
    console.log("add");
  }

}
