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
import {BottomSheetError} from "./elements/error/bottomsheet/error_bottomsheet";
import {WilmaClient} from './main/client';
import {MatSidenavModule} from "@angular/material/sidenav";

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
    WilmaClient
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
    MatSidenavModule
  ],
  providers: [HttpClientModule, ApiClient, GlobalConfig, AccountModel, AuthDatabase, AuthApi],
  bootstrap: [WilmaPlusAppComponent]
})
export class AppModule {}
