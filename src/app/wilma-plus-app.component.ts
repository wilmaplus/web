import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {GlobalConfig} from "./config/global";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {ApiError} from "./client/types/base";
import {AccountSelector} from "./main/account_selector/bottomsheet";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-root',
  templateUrl: './wilma-plus-app.component.html',
  styleUrls: ['./wilma-plus-app.component.css']
})

export class WilmaPlusAppComponent {
  _snackbar: MatSnackBar
  _bottomSheet: MatBottomSheet

  public constructor(_snackBar: MatSnackBar,router: Router, private titleService: Title, private translate: TranslateService, _bottomSheet: MatBottomSheet) {
    this._snackbar = _snackBar;
    this._bottomSheet = _bottomSheet;
  }

  public setTitle(key: string) {
    this.translate.get(key).subscribe((res: string) => {
      this.titleService.setTitle(res+" - "+new GlobalConfig().app_name);
    });
  }

  public showSnackBar(message: any, duration: number) {
    this.translate.get('dismiss').subscribe((value: string) => {
      this._snackbar.open(message, value, {
        duration: duration
      });
    });
  }

  openError(apiError: ApiError, retryCallback: () => void) {
    if (apiError.wilmaError)
      this.openErrorDialog(apiError.errorCode, apiError.errorDescription, retryCallback)
    else
      this.translate.get('error_occurred').subscribe((value: string) => {
        this.openErrorDialog(value, apiError.errorDescription, retryCallback)
      });
  }

  private openErrorDialog(title: any, message: any, retryCallback: () => void) {
    this._bottomSheet.open(AccountSelector, {data: {title: title, message: message, retryCallback: () => {retryCallback()}}});
  }

}
