import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalConfig} from "../config/global";
import {TranslateService} from "@ngx-translate/core";
import {ServerResponse} from "./types/servers";
import {ApiError} from "./types/base";
import {Session} from "./types/wilma_api/session";


@Injectable()
export class ApiClient {
  constructor(private http: HttpClient, private translate: TranslateService, private config: GlobalConfig) {}


  public getWilmaServers(callback: (servers: object[]) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.get<ServerResponse>(ApiClient.correctAddress(this.config.backend_url)+'api/v1/servers').toPromise().then(function (response) {
      if (response.status) {
        callback(response.servers);
      } else {
        ApiError.parseApiError(response, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      }
    }).catch(function (exception) {
      console.log(exception);
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-1', exception.statusText, exception));
      }
    });
  }

  private static correctAddress(url: string) {
    if (!url.endsWith("/"))
      return url+"/"
    return url;
  }

  public getNewWilmaSession(wilmaServer: string, callback: (session: string) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.get<Session>(ApiClient.correctAddress(wilmaServer)+"index_json").toPromise().then(function (response) {
      if (response.LoginResult === "Failed") {
        callback(response.SessionID);
      } else {
        error(new ApiError('wapi-1', "Unexpected value: "+response.LoginResult, response));
      }
    }).catch(function (exception) {
      console.log(exception);
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-1', exception.statusText, exception));
      }
    })
  }

}
