import {Component, Inject} from "@angular/core";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'bottom-sheet-error',
  templateUrl: './error_bottomsheet.html',
})

export class BottomSheetError {
  title: string = ''
  message: string = ''
  retryCallback: void

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {title: string, message: string, retryCallback: void}, private _bottomSheetRef: MatBottomSheetRef<BottomSheetError>) {
    this.title = data.title;
    this.message = data.message;
    this.retryCallback = data.retryCallback;
  }

  retry() {

  }

}
