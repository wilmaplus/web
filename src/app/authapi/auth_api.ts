import {AuthDatabase} from "./db/database";
import {ApiError} from "../client/types/base";
import {AccountModel, IAccountModel} from "./accounts_db/model";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthApi {

  private static SELECTED_ACCOUNT_KEY = 'selected_account_uuid';

  constructor(private authDb: AuthDatabase) {}

  accountsExist(callback: (exists:boolean) => void, error: (apiError: ApiError) => void) {
    this.authDb.accounts.count().then((count: number) => {
      callback(count>0);
    }).catch((exception: any) => {
      error(new ApiError('db-1', exception.toString(), exception));
    })
  }

  accountExists(account: AccountModel, callback: (exists:boolean) => void, error: (apiError: ApiError) => void) {
    this.authDb.accounts.where('[wilmaServer+username+type+primusId]')
      .equals([account.wilmaServer, account.username, account.type, account.primusId]).count()
      .then((count: number) => {
        callback(count>1);
      }).catch((exception: any) => {
        error(new ApiError('db-2', exception.toString(), exception));
      });
  }

  getAccount(account: AccountModel, callback: (accountModel:IAccountModel|undefined) => void, error: (apiError: ApiError) => void) {
    this.authDb.accounts.where('[wilmaServer+username+type+primusId]')
      .equals([account.wilmaServer, account.username, account.type, account.primusId])
      .first()
      .then(callback)
      .catch((exception: any) => {
        error(new ApiError('db-3', exception.toString(), exception));
      });
  }

  addAccount(account: AccountModel, callback: () => void, error: (apiError: ApiError) => void) {
    console.log(account);
    this.authDb.accounts.add(account).then(callback)
      .catch((exception: any) => {
        error(new ApiError('db-4', exception.toString(), exception));
      });
  }

  selectAccount(account: AccountModel) {
    AuthApi.writeToStorage(AuthApi.SELECTED_ACCOUNT_KEY, account.id);
  }

  private static writeToStorage(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }

  private static getFromStorage(key: string): string|null {
    return window.localStorage.getItem(key);
  }

}
