import Dexie from "dexie";
import {IAccountModel} from "../accounts_db/model";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthDatabase extends Dexie {
  accounts: Dexie.Table<IAccountModel, string>;

  constructor() {
    super("auth");
    this.version(3).stores({
      accounts: '&id, wilmaServer, username, password, name, type, primusId, formKey, cookies, settings, photo, school, selectedRole, fullscreenHomepage, messageReceivedColor, messageSentColor, sendFabButton, composeCardColor, messageBackground, darkTheme, [wilmaServer+username+type+primusId]'
    });
    this.accounts = this.table('accounts');
  }
}
