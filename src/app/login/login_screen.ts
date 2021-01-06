import { Component } from '@angular/core';
import {GlobalConfig} from "../config/global";
import {loginMethods} from "./login_methods";

@Component({
  selector: 'app-root',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})


export class LoginScreenComponent {
  app_name = new GlobalConfig().app_name;
  loginMethods = loginMethods
}
