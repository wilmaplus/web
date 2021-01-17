import {v4} from "uuid";
import {Inject, Injectable} from "@angular/core";
import {Homepage, Role} from "../../client/types/wilma_api/homepage";
import {AccountTypes} from "../account_types";

export interface IAccountModel {
  id: string,
  wilmaServer: string
  username: string
  password: string,
  name: string,
  type: number,
  primusId: number,
  formKey: string,
  cookies: string,
  settings: object|null,
  photo: string|null,
  school: string|null,
  selectedRole: string|null,
  fullscreenHomepage: boolean,
  messageReceivedColor: string|null,
  messageSentColor: string|null,
  sendFabButton: string|null,
  composeCardColor: string|null,
  messageBackground: string|null,
  darkTheme: boolean
}

@Injectable()
export class AccountModel implements IAccountModel {
  private _id: string;
  password: string;

  constructor(@Inject(String) public composeCardColor: string|null, @Inject(String) public cookies: string, @Inject(Boolean) public darkTheme: boolean, @Inject(String) public formKey: string, @Inject(Boolean) public fullscreenHomepage: boolean, @Inject(String) public messageBackground: string|null, @Inject(String) public messageReceivedColor: string|null, @Inject(String) public messageSentColor: string|null, @Inject(String) public name: string, @Inject(String) password: string, @Inject(String) public photo: string|null, @Inject(Number) public primusId: number, @Inject(String) public school: string|null, @Inject(String) public selectedRole: string|null, @Inject(String) public sendFabButton: string|null, @Inject(Object) public settings: object|null, @Inject(Number) public type: number, @Inject(String) public username: string, @Inject(String) public wilmaServer: string) {
    this._id = v4();
    this.password = btoa(password);
  }

  public static getPassword(password:string) {
    return atob(password);
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  public static newUser(homepage: Homepage, server: string, username: string, password: string, session: string) {
    let account: Homepage|Role = homepage;
    if (homepage.Roles.length > 0) {
      homepage.Roles.forEach(function (role) {
        if (role.Type == AccountTypes.ACCOUNT) {
          account = role;
        }
      });
    }
    return new AccountModel(null, session, false, account.FormKey, false, null, null, null, account.Name, password, account.Photo, account.PrimusId, account.School, null, null, null, account.Type, username, server);
  }

  public static fromRawModel(model: IAccountModel) {
    let newModel = new AccountModel(model.composeCardColor, model.cookies, model.darkTheme, model.formKey, model.fullscreenHomepage, model.messageBackground, model.messageReceivedColor, model.messageSentColor, model.name, AccountModel.getPassword(model.password), model.photo, model.primusId, model.school, model.selectedRole, model.sendFabButton, model.settings, model.type, model.username, model.wilmaServer);
    newModel.id = model.id;
    console.log(newModel);
    console.log(model);
    return newModel;
  }

  public updateUser(homepage: Homepage, session: string) {
    let account: Homepage|Role = homepage;
    if (homepage.Roles.length > 0) {
      homepage.Roles.forEach(function (role) {
        if (role.Type == AccountTypes.ACCOUNT) {
          account = role;
        }
      });
    }
    this.cookies = session;
    this.formKey = account.FormKey;
    this.type = account.Type;
    this.primusId = account.PrimusId;
    this.school = account.School;
    this.photo = account.Photo;
    this.name = account.Name;
  }

}
