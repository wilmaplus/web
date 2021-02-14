import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { WilmaPlusAppComponent } from './wilma-plus-app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {LoginScreenComponent} from "./login/login_screen";
import {MatGridListModule} from "@angular/material/grid-list";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from "@angular/material/toolbar";
import {ServerSelectComponent} from "./login/server_select/server_select";
import {ApiClient} from "./client/apiclient";
import {GlobalConfig} from "./config/global";
import {WilmaPlusErrorCard} from "./elements/error/error";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatListModule} from "@angular/material/list";
import {MatRippleModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {LoginWilmaComponent} from "./login/basic/basic_login";
import {CustomServerBottomSheet} from "./elements/server_select/custom_server_bottomsheet/bottomsheet";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {AuthApi} from "./authapi/auth_api";
import {AuthDatabase} from "./authapi/db/database";
import {AccountModel} from "./authapi/accounts_db/model";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AccountSelector} from "./main/account_selector/bottomsheet";
import {WilmaClient} from './main/client';
import {MatSidenavModule} from "@angular/material/sidenav";
import {BottomSheetError} from "./elements/error/bottomsheet/error_botomsheet";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {WilmaPlusBottomSheet} from "./main/wilmaplus_bottomsheet/wilmaplus_bottomsheet";
import {Homepage} from "./main/pages/homepage/homepage";
import {Settings} from "./main/pages/settings/settings";
import {MatTabsModule} from "@angular/material/tabs";
import {MatBadgeModule} from '@angular/material/badge';
import {ScheduleTab} from "./main/pages/homepage/mobile/tabs/schedule/schedule";
import {MessagesTab} from "./main/pages/homepage/mobile/tabs/messages/messages";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ReservationElement} from "./main/pages/homepage/mobile/tabs/schedule/elements/reservation/reservation-element.component";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MessageElement} from "./main/elements/message/message-element.component";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    WilmaPlusAppComponent,
    LoginScreenComponent,
    ServerSelectComponent,
    WilmaPlusErrorCard,
    LoginWilmaComponent,
    BottomSheetError,
    CustomServerBottomSheet,
    WilmaClient,
    AccountSelector,
    WilmaPlusBottomSheet,
    Homepage,
    Settings,
    ScheduleTab,
    MessagesTab,
    ReservationElement,
    MessageElement
  ],
  imports: [

    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fi',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatRippleModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HttpClientModule, ApiClient, GlobalConfig, AccountModel, AuthDatabase, AuthApi],
  bootstrap: [WilmaPlusAppComponent]
})
export class AppModule {}
