import { Component } from '@angular/core';
import {GlobalConfig} from "../config/global";
import {loginMethods} from "./login_methods";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {WilmaPlusAppComponent} from "../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {preCheck} from "./utilities/precheck";
import {AuthApi} from "../authapi/auth_api";

@Component({
  selector: 'login-screen',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})


export class LoginScreenComponent extends WilmaPlusAppComponent{

  constructor(_snackBar: MatSnackBar, titleService: Title, router: Router,  translate: TranslateService, private authApi: AuthApi) {
    super(_snackBar, router, titleService, translate);
    this.setTitle('login_screen');
    preCheck(router, authApi);
  }

  app_name = new GlobalConfig().app_name;
  loginMethods = loginMethods
}
