import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {ApiError} from "../../client/types/base";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {ApiClient} from "../../client/apiclient";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {CustomServerBottomSheet} from "../../elements/server_select/custom_server_bottomsheet/bottomsheet";
import {AuthApi} from "../../authapi/auth_api";
import {MatSnackBar} from "@angular/material/snack-bar";
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
  login = {username: '', password: ''}

  constructor(_snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet, private authApi: AuthApi, private router: Router, titleService: Title, translate: TranslateService, private translateService: TranslateService,private _location: Location, private apiClient: ApiClient) {
    super(_snackBar, titleService, translate);
    this.setTitle('sign_in_wilma');
  }

  goBack() {
    this._location.back();
  }

  signIn() {
    this.validateForm(() => {
      this.loading = true;
      this.apiClient.getNewWilmaSession(this.server.url, (session => {
        this.apiClient.signIn(this.login.username, this.login.password, session, this.server.url,  (homepage, session) => {
          this.loading = false;
          // TODO save in DB and forward to homepage
          console.log(homepage);
          this.showSnackBar("Tervetuloa "+homepage.Name+"!", 4000);
        }, (error) => {
          if (error.errorCode === "internal-4" || error.errorCode === "invalid_auth") {
            this.loading = false;
            this.translateService.get('invalid_credentials').subscribe((value: string) => {
              this.showSnackBar(value, 3500);
            })
          } else {
            this.openError(error);
          }
        });
      }), (error) => {
        this.openError(error);
      })
    });
  }

  private validateForm(callback: () => void) {
    this.translateService.get(['invalid_password', 'invalid_username']).subscribe((values:any) => {
      if (this.login.username.length < 1) {
        this.showSnackBar(values.invalid_username, 3000);
        return;
      }
      if (this.login.password.length < 1) {
        this.showSnackBar(values.invalid_password, 3000);
        return;
      }
      callback();
    });

  }

  openError(apiError: ApiError) {
    this.loading = false;
    if (apiError.wilmaError)
      this.openErrorDialog(apiError.errorCode, apiError.errorDescription)
    else
      this.translateService.get('error_occurred').subscribe((value: string) => {
        this.openErrorDialog(value, apiError.errorDescription)
      });
  }

  private openErrorDialog(title: any, message: any) {
    this._bottomSheet.open(BottomSheetError, {data: {title: title, message: message, retryCallback: () => {this.signIn()}}});
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
