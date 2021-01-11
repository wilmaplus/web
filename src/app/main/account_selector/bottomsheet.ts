import {Component, Inject} from "@angular/core";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {IAccountModel} from "../../authapi/accounts_db/model";
import {Role} from "../../client/types/wilma_api/homepage";
import {AuthApi} from "../../authapi/auth_api";
import {TranslateService} from "@ngx-translate/core";

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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {onAccountSelect: (account: IAccountModel) => void, onRoleSelect: (role: Role) => void, title: string|null, addAccounts: boolean}, private _bottomSheetRef: MatBottomSheetRef<AccountSelector>, private authApi: AuthApi, private translator:TranslateService) {
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
  }

  addAccount() {
    console.log("add");
  }

}
