import {ChangeDetectorRef, Component} from "@angular/core";
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

  goBack() {
    this._location.back();
  }

  selectServer(server: object) {
    console.log(server);
  }

}
