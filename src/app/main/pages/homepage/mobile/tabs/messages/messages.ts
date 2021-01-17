import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../../../../authapi/auth_api";


@Component({
  selector: 'wilmaplus-tab-messages',
  templateUrl: './messages.html',
  styleUrls: []
})

export class MessagesTab extends WilmaPlusAppComponent {

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi) {
    super(snackBar, router, titleService, translate, bottomSheet);
    console.log("test2")
  }
}
