import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from "@angular/common/http";
import {GlobalConfig} from "../config/global";
import {TranslateService} from "@ngx-translate/core";
import {ServerResponse} from "./types/servers";
import {ApiError} from "./types/base";
import {Session} from "./types/wilma_api/session";
import {SignInResponse} from "./types/sign_in";
import {Homepage} from "./types/wilma_api/homepage";
import {IAccountModel} from "../authapi/accounts_db/model";
import {Headers, RequestOptions} from "@angular/http";


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
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-1', exception.statusText, exception));
      }
    });
  }

  /**
   * Signing in through backend, because Visma hasn't heard about OPTIONS request (pre-flighting) and that CORS exists in browsers, so...
   * @param username Username
   * @param password Password
   * @param session Session ID
   * @param server Wilma server URL
   * @param callback callback
   * @param error error callback
   */
  public signIn(username: string, password: string, session: string, server: string, callback: (homepage: Homepage, cookie: string) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.post<SignInResponse>(ApiClient.correctAddress(this.config.backend_url)+'api/v1/login', {username: username, password: password, server: server, loginId: session}).toPromise().then(function (response) {
      if (response.status) {
        try {
          callback(response.response, response.session);
        } catch (e) {
          error(new ApiError('internal-5', e.toString(), e));
        }
      } else {
        ApiError.parseApiError(response, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      }
    }).catch(function (exception) {
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-2', exception.statusText, exception));
      }
    });
  }

  /**
   * Getting homepage through backend, because Visma hasn't heard about OPTIONS request (pre-flighting) and that CORS exists in browsers, so...
   * @param account
   * @param callback callback
   * @param error error callback
   */
  public getHomepage(account:IAccountModel, callback: (homepage: Homepage) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.post<SignInResponse>(ApiClient.correctAddress(this.config.backend_url)+'api/v1/homepage', {session: ApiClient.extractSessionId(account.cookies), server: account.wilmaServer}).toPromise().then(function (response) {
      if (response.status) {
        try {
          callback(response.response);
        } catch (e) {
          error(new ApiError('internal-5', e.toString(), e));
        }
      } else {
        ApiError.parseApiError(response, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      }
    }).catch(function (exception) {
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-2', exception.statusText, exception));
      }
    });
  }

  /**
   * Getting homepage through backend, because Visma hasn't heard about OPTIONS request (pre-flighting) and that CORS exists in browsers, so...
   * @param account
   * @param callback callback
   * @param error error callback
   */
  public getSchedule(account:IAccountModel, callback: (homepage: Homepage) => void, error: (apiError: ApiError) => void) {
    let translateService = this.translate;
    this.http.post<SignInResponse>(ApiClient.correctAddress(this.config.backend_url)+'api/v1/schedule', {session: ApiClient.extractSessionId(account.cookies), server: account.wilmaServer}).toPromise().then(function (response) {
      if (response.status) {
        try {
          callback(response.response);
        } catch (e) {
          error(new ApiError('internal-5', e.toString(), e));
        }
      } else {
        ApiError.parseApiError(response, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      }
    }).catch(function (exception) {
      if (exception.status != 0) {
        ApiError.parseApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        }, translateService);
      } else {
        error(new ApiError('internal-2', exception.statusText, exception));
      }
    });
  }

  private static extractSessionId(sessionId: string) {
    let regex = /^(.*)Wilma2SID=([^;]+)(.*)$/;
    let results = regex.exec(sessionId);
    if (results != null && results.length > 2) {
      return results[2];
    }
    return sessionId;
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
        try {
          callback(response.SessionID);
        } catch (e) {
          error(new ApiError('internal-6', e.toString(), e));
        }
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
        error(new ApiError('internal-3', exception.statusText, exception));
      }
    })
  }

  /**
   * Sign in using Wilma's API
   * NOTE: This is NOT WORKING! Because Visma hasn't heard about OPTIONS request (pre-flighting) and that CORS exists in browsers
   * @param wilmaServer
   * @param username
   * @param password
   * @param apiKey
   * @param session
   * @param callback
   * @param error
   * @constructor
   */
  public Wilma_signIn(wilmaServer: string, username: string, password: string, apiKey: string, session: string, callback: (homepage: Homepage) => void, error: (apiError: ApiError) => void) {
    this.http.post<Homepage>(ApiClient.correctAddress(wilmaServer)+"index_json", {}).toPromise().then(function (response) {
      if (response.LoginResult === "Ok") {
        callback(response);
      } else if (response.LoginResult === "Failed") {
        error(new ApiError('internal-4', 'Invalid credentials', response));
      } else {
        error(new ApiError('wapi-1', "Unexpected value: "+response.LoginResult, response));
      }
    }).catch(function (exception) {
      console.log(exception);
      if (exception.status != 0) {
        ApiError.parseWilmaApiError(exception.error, (apiError: ApiError) => {
          error(apiError);
        });
      } else {
        error(new ApiError('internal-3', exception.statusText, exception));
      }
    })
  }


}
