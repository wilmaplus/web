import {Component, Inject} from "@angular/core";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'custom-server-input',
  templateUrl: './bottomsheet.html',
  styleUrls: ['./bottomsheet.scss']
})

export class CustomServerBottomSheet {
  url: any = ''
  urlInvalid: boolean = true
  doneCallback: (url: string) => void

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {doneCallback: (url: string) => void}, private _bottomSheetRef: MatBottomSheetRef<CustomServerBottomSheet>) {
    this.doneCallback = data.doneCallback;
  }

  onInputChange() {
    const reg = 'https://([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const control = new FormControl(this.url, Validators.pattern(reg));
    let valid = true;
    let isValid = (control.errors == null);
    if (!isValid) {
      let isSecondValid = new FormControl('https://'+this.url, Validators.pattern(reg)).errors == null;
      if (!isSecondValid) {
        valid = false;
      }
    }
    this.urlInvalid = !valid;
  }

  getFinalUrl() {
    const reg = 'https://([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const control = new FormControl(this.url, Validators.pattern(reg));
    let isValid = (control.errors == null);
    if (!isValid) {
      let isSecondValid = new FormControl('https://'+this.url, Validators.pattern(reg)).errors == null;
      if (isSecondValid) {
        return 'https://'+this.url;
      }
    } else
      return this.url;
  }

  done() {
    this._bottomSheetRef.dismiss();
    this.doneCallback(this.getFinalUrl());
  }

}
