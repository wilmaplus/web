import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../wilma-plus-app.component";
import {GlobalConfig} from "../config/global";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {AuthApi} from "../authapi/auth_api";
import {Router} from "@angular/router";
import { version } from '../../../package.json';

@Component({
  selector: 'wilma-client',
  templateUrl: './client.html',
  styleUrls: ['./client.scss']
})

export class WilmaClient extends WilmaPlusAppComponent {
  pageTitle = new GlobalConfig().app_name
  appName = new GlobalConfig().app_name
  version = version
  ui = {
    name: null,
    school: null,
    profileImage: null
  }

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, private authApi: AuthApi) {
    super(snackBar, router, titleService, translate);
    console.log(version);
    authApi.accountsExist(exists => {
      if (!exists) {
        router.navigate(['/login']);
      }
    }, error => {
      console.log(error);
    });
  }
}
