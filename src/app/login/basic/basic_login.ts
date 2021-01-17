import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {ApiError} from "../../client/types/base";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {ApiClient} from "../../client/apiclient";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AuthApi} from "../../authapi/auth_api";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AccountModel} from "../../authapi/accounts_db/model";
import {preCheck} from "../utilities/precheck";

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

  constructor(_snackBar: MatSnackBar,_bottomSheet: MatBottomSheet, private authApi: AuthApi, private router: Router, titleService: Title, translate: TranslateService, private translateService: TranslateService,private _location: Location, private apiClient: ApiClient) {
    super(_snackBar, router, titleService, translate, _bottomSheet);
    this.setTitle('sign_in_wilma');
    preCheck(router, authApi);
  }

  goBack() {
    this._location.back();
  }


  signIn() {
    this.validateForm(() => {
      this.loading = true;
      // Getting new Login session
      this.apiClient.getNewWilmaSession(this.server.url, (session => {
        // Signing in
        this.apiClient.signIn(this.login.username, this.login.password, session, this.server.url,  (homepage, session) => {
          // Creating new account model
          let account = AccountModel.newUser(homepage, this.server.url, this.login.username, this.login.password, session);
          this.authApi.accountExists(account, (exists) => {
            if (exists) {
              // Account exists, alerting user and stopping
              this.loading = false;
              this.translateService.get('account_exists').subscribe((value: string) => {
                this.showSnackBar(value, 3500);
              });
            } else {
             // Adding account and setting as selected
              this.authApi.addAccount(account, () => {
                this.authApi.selectAccount(account);
                this.authApi.addOrReplaceRoles(this.authApi.convertApiRoles(account.id, homepage.Roles), () => {
                  // Navigating to client
                  this.router.navigate(['/']);
                }, error => {
                  this.loading = false;
                  this.openError(error, () => {this.signIn()})
                })
              },  (error) => {
                this.loading = false;
                this.openError(error, () => {this.signIn()})})
            }
          }, (error) => {
            this.loading = false;
            this.openError(error, () => {this.signIn()})});
          console.log(homepage);
        }, (error) => {
          if (error.errorCode === "internal-4" || error.errorCode === "invalid_auth") {
            this.loading = false;
            this.translateService.get('invalid_credentials').subscribe((value: string) => {
              this.showSnackBar(value, 3500);
            })
          } else {
            this.openError(error, () => {this.signIn()});
          }
        });
      }), (error) => {this.openError(error, () => {this.signIn()})})
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


  ngOnInit(): void {
    if (window.history.state.server) {
      this.server = window.history.state.server;
    } else {
      this.router.navigate(['/login/select_server'])
    }
  }

}
