import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";
import {WilmaErrorBody, WilmaError} from './wilma_api/common';

export class ApiError {
  private _error: any = false;
  private _errorCode: any = null
  private _errorDescription: any = null
  private _additionalDetails: any = null
  private _wilmaError: boolean = false;
  private _reLogin: boolean = false;
  private _completeMFA: boolean = false;


  constructor(errorCode: any, errorDescription: any, additionalDetails: any, error=true, wilmaError=false, reLogin=false, completeMFA=false) {
    this._error = error;
    this._errorCode = errorCode;
    this._errorDescription = errorDescription;
    this._additionalDetails = additionalDetails;
    this._wilmaError = wilmaError;
    this._reLogin = reLogin;
    this._completeMFA = completeMFA;
  }


  public static emptyError() {
    return new ApiError(null, null, null, false);
  }

  public static mfaError(mfaSession: any) {
    return new ApiError(mfaSession, null, null, false, false, false, true);
  }

  get completeMFA(): boolean {
    return this._completeMFA;
  }

  set completeMFA(value: boolean) {
    this._completeMFA = value;
  }

  get errorCode(): any {
    return this._errorCode;
  }

  set errorCode(value: any) {
    this._errorCode = value;
  }

  get errorDescription(): any {
    return this._errorDescription;
  }

  set errorDescription(value: any) {
    this._errorDescription = value;
  }

  get additionalDetails(): any {
    return this._additionalDetails;
  }


  get reLogin(): boolean {
    return this._reLogin;
  }

  set additionalDetails(value: any) {
    this._additionalDetails = value;
  }

  get error(): boolean {
    return this._error;
  }


  get wilmaError(): boolean {
    return this._wilmaError;
  }

  public static parseApiError(response: ApiResponse, callback: (apiError: ApiError) => void, translate: TranslateService) {
    let code = response.cause;
    let reason = code;
    if (response.wilma) {
      if (response.wilma.id === "common-20" || response.wilma.id === "common-18" || response.wilma.id === "common-15" || response.wilma.id === "common-34" || response.wilma.id === 'wilmaplus-web-mfa') {
        callback(new ApiError(response.wilma.id+": "+response.wilma.message, response.wilma.description, response, true, true, true));
        return;
      }
      callback(new ApiError(response.wilma.id+": "+response.wilma.message, response.wilma.description, response, true, true));
      return;
    }
    if (response.localization) {
      translate.get(response.localization).subscribe((value: string) => {
        reason = value;
        callback(new ApiError(code, reason, response));
      });
      return;
    }
    callback(new ApiError(code, reason, response));
  }

  public static parseWilmaApiError(response: WilmaError, callback: (apiError: ApiError) => void) {
    if (response.error.id === "common-20" || response.error.id === "common-18" || response.error.id === "common-15" || response.error.id === "common-34" || response.error.id === 'wilmaplus-web-mfa') {
      callback(new ApiError(response.error.id+': '+response.error.message, response.error.description, response, true, true, true));
      return;
    }
    callback(new ApiError(response.error.id+': '+response.error.message, response.error.description, response, true, true));
  }

}

export interface ApiResponse {
  status: boolean;
  cause: string;
  localization: string;
  wilma: WilmaErrorBody;
}

