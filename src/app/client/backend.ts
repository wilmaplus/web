import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalConfig} from "../config/global";
import {TranslateService} from "@ngx-translate/core";
import {ServerResponse} from "./types/servers";
import {ApiError} from "./types/base";


@Injectable()
export class ApiClient {
  constructor(private http: HttpClient, private translate: TranslateService, private config: GlobalConfig) {}


  public getWilmaServers(callback: (servers: object[]) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.get<ServerResponse>(this.config.backend_url+'/api/v1/servers').toPromise().then(function (response) {
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


}
