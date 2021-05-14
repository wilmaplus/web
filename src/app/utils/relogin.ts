import {ApiClient} from "../client/apiclient";
import {AuthApi} from "../authapi/auth_api";
import {AccountModel, IAccountModel} from "../authapi/accounts_db/model";
import {ApiError} from "../client/types/base";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {WilmaPlusBottomSheet} from "../main/wilmaplus_bottomsheet/wilmaplus_bottomsheet";
import {BottomSheetMFAPrompt} from "../elements/mfa/bottomsheet/mfa_bottomsheet";
import {Homepage} from "../client/types/wilma_api/homepage";

export class ReLoginUtils {

  private static handleMFA(session: string, homepage: Homepage, server: string,  api: ApiClient, _bottomSheet: MatBottomSheet | null = null, callback: (otpToken: string) => void) {
    if (_bottomSheet == null)
      return;
    _bottomSheet.open(BottomSheetMFAPrompt, {data: {doneCallback: callback, homepage, session, server, apiClient: api}, disableClose: true, panelClass: 'removePadding'});
  }


  public static reLogin(api: ApiClient, authApi: AuthApi, doneCallback: () => void, errorCallback: (error: ApiError) => void, account: IAccountModel | null = null, _bottomSheet: MatBottomSheet | null = null) {
    let bottomSheet: MatBottomSheetRef<WilmaPlusBottomSheet, any> | null = null;
    if (_bottomSheet != null) {
      bottomSheet = _bottomSheet.open(WilmaPlusBottomSheet, {data: {translate: true, title: 'signing_in', details: 'please_wait', showProgressBar: true}, disableClose: true});
    }
    if (account == null) {
      authApi.getSelectedAccount((selectedAccount) => {
        if (selectedAccount !== undefined) {
          this.doReLogin(api, authApi, () => {
            if (bottomSheet != null)
              bottomSheet.dismiss();
            doneCallback();
          }, (err) => {
            if (!err.completeMFA) {
              errorCallback(err);
              return;
            }
            console.log("MFA!");
            this.handleMFA(err.errorCode.session, err.errorCode.homepage, selectedAccount.wilmaServer, api, _bottomSheet, (otpToken) => {
              console.log("MFA Handle!");
              this.finishOTP(authApi, () => {
                if (bottomSheet != null)
                  bottomSheet.dismiss();
                doneCallback();
              }, errorCallback, selectedAccount, err.errorCode.homepage, err.errorCode.session, otpToken);
            });
          }, selectedAccount, () => {
            if (bottomSheet != null)
              bottomSheet.dismiss();
          });
        }
      }, errorCallback);
    } else {
      this.doReLogin(api, authApi, () => {
        if (bottomSheet != null)
          bottomSheet.dismiss();
        doneCallback();
      }, (err) => {
        if (!err.completeMFA) {
          errorCallback(err);
          return;
        }
        console.log("MFA!");
        this.handleMFA(err.errorCode.session, err.errorCode.homepage, account.wilmaServer, api, _bottomSheet, (otpToken) => {
          console.log("MFA Handle!");
          this.finishOTP(authApi, () => {
            if (bottomSheet != null)
              bottomSheet.dismiss();
            doneCallback();
          }, errorCallback, account, err.errorCode.homepage, err.errorCode.session, otpToken);
        });
        // TODO handle MFA
      }, account, () => {
        if (bottomSheet != null)
          bottomSheet.dismiss();
      });
    }
  }

  private static finishOTP(authApi: AuthApi, doneCallback: () => void, errorCallback: (error: ApiError) => void, account: IAccountModel, homepage: Homepage, session: string, otpToken: string) {
    let accountModel = AccountModel.fromRawModel(account);
    accountModel.cookies = session;
    accountModel.mfaToken = otpToken;
    accountModel.formKey = homepage.FormKey;
    authApi.updateAccount(accountModel, () => {
      doneCallback();
    }, error => {errorCallback(error)});
  }

  private static doReLogin(api: ApiClient, authApi: AuthApi, doneCallback: () => void, errorCallback: (error: ApiError) => void, account: IAccountModel, failCallback: () => void) {
    let decodedPassword = AccountModel.getPassword(account.password);
    api.getNewWilmaSession(account.wilmaServer, (session => {
      api.signIn(account.username, decodedPassword, session, account.wilmaServer, (homepage, cookies: string) => {
        let accountModel = AccountModel.fromRawModel(account);
        accountModel.updateUser(homepage, cookies);
        authApi.updateAccount(accountModel, () => {
          doneCallback();
        }, error => {failCallback();errorCallback(error)});
      }, error => {
        failCallback();
        // Credentials invalid (likely password)
        if (error.errorCode === "internal-4" || error.errorCode === "invalid_auth") {
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
