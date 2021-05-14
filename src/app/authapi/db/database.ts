import Dexie from "dexie";
import {IAccountModel} from "../accounts_db/model";
import {Injectable} from "@angular/core";
import {IRoleModel} from "../roles_db/model";

@Injectable()
export class AuthDatabase extends Dexie {
  accounts: Dexie.Table<IAccountModel, string>;
  roles: Dexie.Table<IRoleModel, string>;

  constructor() {
    super("auth");
    this.version(5).stores({
      accounts: '&id, wilmaServer, username, password, name, type, primusId, formKey, cookies, mfaToken, settings, photo, school, selectedRole, fullscreenHomepage, messageReceivedColor, messageSentColor, sendFabButton, composeCardColor, messageBackground, darkTheme, [wilmaServer+username+type+primusId]',
      roles: '&id, Slug, Name, Type, PrimusId, FormKey, Photo, EarlyEduUser, School, owner, [Slug+owner], [PrimusId+Type+owner]'
    });
    this.accounts = this.table('accounts');
    this.roles = this.table('roles');
  }
}
