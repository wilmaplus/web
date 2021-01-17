import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'wilmaplus-homepage',
  templateUrl: './homepage.html',
  styleUrls: []
})

export class Homepage extends WilmaPlusAppComponent {


  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet) {
    super(snackBar, router, titleService, translate, bottomSheet);
    console.log("test");
  }
}
