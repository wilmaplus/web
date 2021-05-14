import {Component, Inject} from "@angular/core";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

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
