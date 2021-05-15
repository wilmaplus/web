import {Component, Inject, ViewChild} from "@angular/core";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {ApiClient} from "../../../client/apiclient";
import {Homepage} from "../../../client/types/wilma_api/homepage";
import {OTPResponse} from "../../../client/types/sign_in";
import {ApiError} from "../../../client/types/base";
import {BottomSheetError} from "../../error/bottomsheet/error_bottomsheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../authapi/auth_api";
import {AccountModel} from "../../../authapi/accounts_db/model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'bottom-sheet-mfa',
  templateUrl: './mfa_bottomsheet.html',
  styleUrls: ['./mfa_bottomsheet.scss']
})

export class BottomSheetMFAPrompt {
  doneCallback: (otpToken: string) => void
  homepage: Homepage
  apiClient: ApiClient
  server: string;
  session: string;
  loading: boolean = false;
  invalid: boolean = false;
  otherAccountsFound: boolean = false;
  @ViewChild('otpCode') ngOtpInputRef:any;
  private router: Router;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {doneCallback: () => void, homepage: Homepage, server: string, session: string, apiClient: ApiClient}, private translate: TranslateService, private _bottomSheet: MatBottomSheet, private _bottomSheetRef: MatBottomSheetRef<BottomSheetMFAPrompt>, private activatedRoute: ActivatedRoute, private authApi: AuthApi, router: Router) {
    this.doneCallback = data.doneCallback;
    this.homepage = data.homepage;
    this.server = data.server;
    this.session = data.session;
    this.apiClient = data.apiClient;
    this.router = router;
    console.log({home: this.homepage, session: this.session});
    this.authApi.getAllAccounts(accounts => {
      console.log(accounts.length);
      this.otherAccountsFound = accounts.length > 1;
      console.log(this.otherAccountsFound);
    }, error => {
      this.translate.get('error_occurred').subscribe((value: string) => {
        this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error, retryCallback: () => {this.changeAccount()}}, disableClose: true});
      });
    })
  }

  onOtpChange() {
    let code = '';
    console.log(this.ngOtpInputRef);
    Object.values(this.ngOtpInputRef.otpForm.value).forEach((digit: any) => {
      if (digit !== null) {
        code += digit;
      }
    });
    if (code.length === 6) {
      console.log(code);
      this.loading = true;
      this.invalid = false;
      this.applyOTP(code, response => {
        this.loading = false;
        this._bottomSheetRef.dismiss();
        this.doneCallback(response.otpToken);
      }, error => {
        console.log(error);
        this.loading = false;
        if (error.additionalDetails && error.additionalDetails.localization === 'otp_invalid') {
          // CODE INVALID!
          this.invalid = true;
          return;
        }
        if (error.wilmaError) {
          this._bottomSheet.open(BottomSheetError, {data: {title: error.errorCode, message: error.errorDescription, retryCallback: () => {this.onOtpChange()}}, disableClose: true});
        } else {
          this.translate.get('error_occurred').subscribe((value: string) => {
            this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error.errorDescription, retryCallback: () => {this.onOtpChange()}}, disableClose: true});
          });
        }
      })
    }
  }

  applyOTP(code: string, callback: (otpResponse: OTPResponse) => void, errorCallback: (apiError: ApiError) => void) {
    this.apiClient.applyOTP(this.session, this.server, this.homepage.FormKey, code, callback, errorCallback);
  }

  changePage(page: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
      this.router.navigate([page], {relativeTo: this.activatedRoute});
    });
  }

  changeAccount() {
    if (!this.otherAccountsFound) {
      this.authApi.getSelectedAccount(account => {
        if (account === undefined) {
          return;
        }
        this.authApi.deleteAccount(AccountModel.fromRawModel(account), () => {
          this.changePage('login');
          this._bottomSheetRef.dismiss();
        }, error => {
          this.translate.get('error_occurred').subscribe((value: string) => {
            this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error, retryCallback: () => {this.changeAccount()}}, disableClose: true});
          });
        })
      }, error => {
        this.translate.get('error_occurred').subscribe((value: string) => {
          this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error, retryCallback: () => {this.changeAccount()}}, disableClose: true});
        });
      });
    } else {
      this.authApi.getAllAccounts(accounts => {
        this.authApi.getSelectedAccount(account => {
          let filteredAccountList = accounts.filter(item => {return item.id !== account?.id});
          this.authApi.selectAccount(filteredAccountList[0]);
          this._bottomSheetRef.dismiss();
          window.location.reload();
        }, error => {
          this.translate.get('error_occurred').subscribe((value: string) => {
            this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error, retryCallback: () => {this.changeAccount()}}, disableClose: true});
          });
        })
      }, error => {
        this.translate.get('error_occurred').subscribe((value: string) => {
          this._bottomSheet.open(BottomSheetError, {data: {title: value, message: error, retryCallback: () => {this.changeAccount()}}, disableClose: true});
        });
      })
    }

  }

}
