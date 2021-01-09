import {ChangeDetectorRef, Component, HostListener, Pipe} from "@angular/core";
import {Location} from '@angular/common';
import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {ApiClient} from "../../client/backend";
import {ApiError} from "../../client/types/base";

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

  constructor(titleService: Title, translate: TranslateService, private _location: Location, private apiClient: ApiClient, private chRef: ChangeDetectorRef) {
    super(titleService, translate);
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
  keyHandler(event: object) {
    // @ts-ignore
    if (event.key === "Escape") {
      this.disableSearch();
    }
  }

  goBack() {
    this._location.back();
  }

  selectServer(server: object) {
    this._location.go('login', '', server)
  }

  filterServers() {
    if (this.searchQuery.length > 0)
      return this.servers.filter((item: any) => {return (item.url.includes(this.searchQuery) || item.name.includes(this.searchQuery))});
    else
      return this.servers;
  }

}
