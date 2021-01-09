import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {GlobalConfig} from "./config/global";

@Component({
  selector: 'app-root',
  templateUrl: './wilma-plus-app.component.html',
  styleUrls: ['./wilma-plus-app.component.css']
})

export class WilmaPlusAppComponent {
  public constructor(private titleService: Title, private translate: TranslateService) {
  }

  public setTitle(key: string) {
    this.translate.get(key).subscribe((res: string) => {
      this.titleService.setTitle(res+" - "+new GlobalConfig().app_name);
    });
  }
}
