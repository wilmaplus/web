import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {GlobalConfig} from "./config/global";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './wilma-plus-app.component.html',
  styleUrls: ['./wilma-plus-app.component.css']
})

export class WilmaPlusAppComponent {
  _snackbar: MatSnackBar

  public constructor(_snackBar: MatSnackBar, private titleService: Title, private translate: TranslateService) {
    this._snackbar = _snackBar;
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
}
