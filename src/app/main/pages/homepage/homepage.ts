import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {UISettings} from "../../client";
import {AccountModel, IAccountModel} from "../../../authapi/accounts_db/model";
import {RoleModel} from "../../../authapi/roles_db/model";
import {AccountTypes} from "../../../authapi/account_types";
import {AuthApi} from "../../../authapi/auth_api";
import {MiscUtils} from "../../../utils/misc";
import {ApiClient} from "../../../client/apiclient";
import {ReLoginUtils} from "../../../utils/relogin";
import {CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'wilmaplus-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})

export class Homepage extends WilmaPlusAppComponent {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList> | undefined;
  @ViewChild(CdkDropList) placeholder: CdkDropList | undefined;

  mobile: boolean = false
  ui = new UISettings()
  account:IAccountModel|undefined=undefined
  tabs: any = []
  fetchedHomepage = false
  private translateService: TranslateService
  wPlusRouter: Router

  cols : number = 0;

  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1
  }


  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi, private apiClient:ApiClient, private _sanitizer: DomSanitizer, private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.translateService = translate;
    this.wPlusRouter = router;
    this.refreshUI(true);
  }

  refreshUI(renderUi: boolean) {
    this.authApi.getSelectedAccount(account => {
      if (account !== undefined) {
        this.account = account;
        if (account.type == AccountTypes.ACCOUNT) {
          if (account.selectedRole !== null) {
            this.authApi.getRole(account.selectedRole, (role) => {
              if (role !== undefined) {
                this.updateUIWithRole(role);
                if (renderUi)
                  this.renderUI();
              }
            }, error => {
              this.openError(error, () => {this.refreshUI(renderUi)});
            })
          }
        } else {
          this.updateUIWithAccount(account);
          if (renderUi)
            this.renderUI();
        }
      }
    }, (error) => {this.openError(error, () => {this.refreshUI(renderUi)})});
  }

  getBase64Image(imageString: string) {
    return MiscUtils.getBase64Image(imageString, this._sanitizer);
  }

  private updateUIWithAccount(account: IAccountModel) {
    // Setting UI details for account
    this.ui.name = account?.name;
    this.ui.school = account.school;
    this.ui.profileImage = account.photo;
    this.ui.type = MiscUtils.getType(account.type);
  }

  private updateUIWithRole(role: RoleModel) {
    // Setting UI details for role
    this.ui.name = role?.Name;
    this.ui.school = role.School;
    this.ui.profileImage = role.Photo;
    this.ui.type = MiscUtils.getType(role.Type);
  }

  private refreshProfile() {
    if (this.account === undefined)
      return;
    this.apiClient.getHomepage(this.account, (homepage) => {
      if (this.account === undefined)
        return;
      let model = AccountModel.fromRawModel(this.account);
      model.updateUser(homepage)
      this.authApi.updateAccount(model, () => {
        this.fetchedHomepage = true;
        this.refreshUI(true);
      }, error => {
        this.openError(error, () => {this.refreshProfile()})
      })
    }, error => {
      if (error.reLogin) {
        ReLoginUtils.reLogin(this.apiClient, this.authApi, () => {
          if (!this.mobile) {
            // Small hack to fix glitchy homepage on desktop
            this.wPlusRouter.navigate(['/']).then(() => {
              setTimeout(() => {
                this.wPlusRouter.navigate(['/home']);
              }, 200);
            });
          } else
            this.refreshUI(true);
        }, (error) => {
          this.openError(error, () => {this.refreshProfile()})
        }, this.account, this._bottomSheet);
        return;
      } else {
        this.openError(error, () => {this.refreshProfile()})
      }
    });
  }

  private renderUI(msgBadge: string='') {
    if (!this.fetchedHomepage)
      this.refreshProfile();
    if (this.mobile) {
      if (environment.production) {
        this.tabs = [
          {icon: 'calendar_today', type: 1, badge: ''},
          {icon: 'message', type: 2, badge: msgBadge}
        ]
      } else {
        this.tabs = [
          {icon: 'calendar_today', type: 1, badge: ''},
          {icon: 'message', type: 2, badge: msgBadge}
        ];
        console.log(this.tabs);
      }
    } else {
      if (environment.production) {
        setTimeout(() => {this.tabs = [];this.cdr.detectChanges();})
        setTimeout(() => {
          this.tabs = [
            {type: 1},
            {type: 2}
          ];
          this.cdr.detectChanges();
        });
      } else {
        setTimeout(() => {this.tabs = [];this.cdr.detectChanges();})
        setTimeout(() => {
          this.tabs = [
            {type: 1},
            {type: 2}
          ];
          this.cdr.detectChanges();
        });
      }
    }
  }

  getMessagesCallback = (badgeValue: string) => {
    this.tabs[1].badge = badgeValue;
  }

  getCurrentDateAndTime() {
    return MiscUtils.getCurrentDateAndTime(this.translateService);
  }

  ngOnInit() {
    if (window.screen.width >= 360 && window.screen.width < 1024) { // 768px portrait
      this.mobile = true;
    } else {
      this.breakpointObserver.observe([
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ]).subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = this.gridByBreakpoint.xs;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.cols = this.gridByBreakpoint.sm;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this.gridByBreakpoint.md;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this.gridByBreakpoint.lg;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.cols = this.gridByBreakpoint.xl;
          }
        }
      });
    }
  }

}
