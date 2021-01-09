import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {ApiError} from "../../client/types/base";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {ApiClient} from "../../client/backend";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {BottomSheetError} from "../../elements/error/bottomsheet/error_bottomsheet";

@Component({
  selector: 'login-wilma',
  templateUrl: './basic_login.html',
  styleUrls: ['./basic_login.scss']
})

export class LoginWilmaComponent extends WilmaPlusAppComponent implements OnInit {
  server: any = null
  loading: boolean = false
  error = ApiError.emptyError();
  formError = {username: null, password: null}
  login = {username: '', password: ''}

  constructor(private _bottomSheet: MatBottomSheet, private router: Router, titleService: Title, translate: TranslateService, private translateService: TranslateService,private _location: Location, private apiClient: ApiClient) {
    super(titleService, translate);
    this.setTitle('sign_in_wilma');
  }

  goBack() {
    this._location.back();
  }

  signIn() {
    this.loading = true;
    this.apiClient.getNewWilmaSession(this.server.url, (session => {
      console.log(session);
    }), (error) => {
      this.openError(error.errorDescription);
    })
  }

  openError(errorMessage: any, title: any = null) {
    if (title == null)
    this.translateService.get('error_occurred').subscribe((value: string) => {
      this.openErrorDialog(value, errorMessage)
    });
    else
      this.openErrorDialog(title, errorMessage);
  }

  private openErrorDialog(title: any, message: any) {
    this._bottomSheet.open(BottomSheetError, {data: {title: title, message: message}});

  }

  ngOnInit(): void {
    console.log(window.history.state);
    if (window.history.state.server) {
      this.server = window.history.state.server;
    } else {
      this.router.navigate(['/login/select_server'])
    }
  }

}
