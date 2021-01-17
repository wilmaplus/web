import {ApiClient} from "../client/apiclient";
import {AuthApi} from "../authapi/auth_api";
import {AccountModel, IAccountModel} from "../authapi/accounts_db/model";
import {ApiError} from "../client/types/base";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {WilmaPlusBottomSheet} from "../main/wilmaplus_bottomsheet/wilmaplus_bottomsheet";

export class ReLoginUtils {
  public static reLogin(api: ApiClient, authApi: AuthApi, doneCallback: () => void, errorCallback: (error: ApiError) => void, account: IAccountModel | null = null, _bottomSheet: MatBottomSheet | null = null) {
    let bottomSheet: MatBottomSheetRef<WilmaPlusBottomSheet, any> | null = null;
    if (_bottomSheet != null) {
      bottomSheet = _bottomSheet.open(WilmaPlusBottomSheet, {data: {translate: true, title: 'signing_in', details: 'please_wait', showProgressBar: true}, disableClose: true})
    }
    if (account == null) {
      authApi.getSelectedAccount((selectedAccount) => {
        if (selectedAccount !== undefined) {
          this.doReLogin(api, authApi, () => {
            if (bottomSheet != null)
              bottomSheet.dismiss();
            doneCallback();
          }, errorCallback, selectedAccount, () => {
            errorCallback(new ApiError('internal-12', 'Unexpected value: '+selectedAccount, selectedAccount));
          });
        }
      }, errorCallback);
    }
  }

  private static doReLogin(api: ApiClient, authApi: AuthApi, doneCallback: () => void, errorCallback: (error: ApiError) => void, account: IAccountModel, failCallback: () => void) {
    let decodedPassword = AccountModel.getPassword(account.password);
    api.getNewWilmaSession(account.wilmaServer, (session => {
      api.signIn(account.username, decodedPassword, session, account.wilmaServer, (homepage, cookies: string) => {
        console.log(homepage);
        let accountModel = AccountModel.fromRawModel(account);
        accountModel.updateUser(homepage, cookies);
        authApi.updateAccount(accountModel, () => {
          doneCallback();
        }, error => {failCallback();errorCallback(error)});
      }, error => {
        failCallback();
        // Credentials invalid (likely password)
        if (error.errorCode === "internal-4" || error.errorCode === "invalid_auth") {
          console.log("invalid auth!");
          return;
        }
        errorCallback(error);
      })
    }), error => {
      failCallback();
      errorCallback(error);
    })
  }
}
