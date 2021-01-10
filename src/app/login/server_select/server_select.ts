import {ChangeDetectorRef, Component, HostListener, Pipe} from "@angular/core";
import {Location} from '@angular/common';
import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {ApiClient} from "../../client/apiclient";
import {ApiError} from "../../client/types/base";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {BottomSheetError} from "../../elements/error/bottomsheet/error_bottomsheet";
import {CustomServerBottomSheet} from "../../elements/server_select/custom_server_bottomsheet/bottomsheet";
import {Router} from "@angular/router";

@Component({
  selector: 'server-select',
  templateUrl: './server_select.html',
  styleUrls: ['./selector.scss']
})

export class ServerSelectComponent extends WilmaPlusAppComponent {

  servers: any = []
  loading: boolean = true
  error = ApiError.emptyError();
  searchQuery = ''
  search = false

  constructor(_snackBar: MatSnackBar, private router: Router, private _bottomSheet: MatBottomSheet,titleService: Title, translate: TranslateService, private _location: Location, private apiClient: ApiClient, private chRef: ChangeDetectorRef) {
    super(_snackBar, titleService, translate);
    this.setTitle('select_wilma_server');
    this.apiClient.getWilmaServers((servers: object[]) => {
      this.loading = false;
      this.servers = servers;
      chRef.detectChanges();
      console.log(this.servers);
    }, (error: ApiError) => {
      this.loading = false;
      this.error = error;
      chRef.detectChanges();
    });
  }

  disableSearch() {
    this.searchQuery = '';
    this.search = false;
  }

 @HostListener('document:keydown.escape', ['$event'])
  keyHandler(event: any) {
    if (event.key === "Escape") {
      this.disableSearch();
    }
  }

  openAddServer() {
    let callback = (url: string) => {
      console.log(url);
      this.router.navigate(['/login/wilma'], {state: {server: {url: url, name: null}}})
    };
    this._bottomSheet.open(CustomServerBottomSheet, {data: {doneCallback: callback}});
  }

  goBack() {
    this._location.back();
  }

  filterServers() {
    if (this.searchQuery.length > 0)
      return this.servers.filter((item: any) => {return (item.url.includes(this.searchQuery) || item.name.includes(this.searchQuery))});
    else
      return this.servers;
  }

}
