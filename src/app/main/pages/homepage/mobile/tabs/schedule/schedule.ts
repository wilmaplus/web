import {Component} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../../../../authapi/auth_api";
import {ApiClient} from "../../../../../../client/apiclient";


@Component({
  selector: 'wilmaplus-tab-schedule',
  templateUrl: './schedule.html',
  styleUrls: []
})

export class ScheduleTab extends WilmaPlusAppComponent {
  loading = false;

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi, private apiClient: ApiClient) {
    super(snackBar, router, titleService, translate, bottomSheet);
  }

  loadSchedule() {
    this.authApi.getSelectedAccount(accountModel => {
      if (accountModel !== undefined) {
        this.apiClient.getSchedule(accountModel, schedule => {
          console.log(schedule);
        }, error => {
          // Re-login is handled by homepage, so tab is being silent while homepage re-logins.
          if (error.reLogin)
            return;
          this.openError(error, () => {this.loadSchedule()});
        })
      }
    }, error => {
      this.openError(error, () => {this.loadSchedule()});
    })
  }
}
