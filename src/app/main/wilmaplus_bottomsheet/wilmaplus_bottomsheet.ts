import {Component, Inject} from "@angular/core";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {IAccountModel} from "../../authapi/accounts_db/model";
import {Role} from "../../client/types/wilma_api/homepage";
import {AuthApi} from "../../authapi/auth_api";
import {TranslateService} from "@ngx-translate/core";
import {ApiClient} from "../../client/apiclient";
import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ReLoginUtils} from "../../utils/relogin";

@Component({
  selector: 'wilmaplus-bottomsheet',
  templateUrl: './wilmaplus_bottomsheet.html',
  styleUrls: ['./wilmaplus_bottomsheet.scss']
})

export class WilmaPlusBottomSheet {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data:
                {translate: boolean, negativeListener: () => void, positiveListener: () => void, positiveText: string|undefined, negativeText: string|undefined, negativeColor:string|undefined, positiveColor:string|undefined, title:string, details:string, showProgressBar:boolean, hideNegativeButton: boolean, checkBoxText: string|null, checkBoxChecked:boolean}, private _bottomSheetRef: MatBottomSheetRef<WilmaPlusBottomSheet>) {

  }
}
