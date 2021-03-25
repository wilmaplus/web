import {WilmaPlusAppComponent} from "../../../../../wilma-plus-app.component";
import {Component, Input} from "@angular/core";
import {UISettings} from "../../../../client";
import {MiscUtils} from "../../../../../utils/misc";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import * as moment from "moment";

@Component({
  selector: 'wilmaplus-card-badge',
  templateUrl: './badge.html',
  styleUrls: ['./badge.scss']
})
export class BadgeCardElement extends WilmaPlusAppComponent {
  @Input()
  ui: UISettings = new UISettings();
  private readonly translateService: TranslateService

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private _sanitizer: DomSanitizer) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.translateService = translate;
  }

  getCurrentDateAndTime() {
    return MiscUtils.getCurrentDateAndTime(this.translateService);
  }

  getBase64Image(imageString: string) {
    return MiscUtils.getBase64Image(imageString, this._sanitizer);
  }
}
