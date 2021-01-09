import {Component} from "@angular/core";
import {Location} from '@angular/common';
import {WilmaPlusAppComponent} from "../../wilma-plus-app.component";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './server_select.html'
})


export class ServerSelectComponent extends WilmaPlusAppComponent {


  constructor(titleService: Title, translate: TranslateService, private _location: Location) {
    super(titleService, translate);
    this.setTitle('select_wilma_server');
  }

  goBack() {
    this._location.back();
  }

}
