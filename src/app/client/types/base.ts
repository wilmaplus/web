import {TranslateService} from "@ngx-translate/core";

export class ApiError {
  private _error = false;
  private _errorCode = null
  private _errorDescription = null
  private _additionalDetails = null


  constructor(errorCode: any, errorDescription: any, additionalDetails: any, error=true) {
    this._error = error;
    this._errorCode = errorCode;
    this._errorDescription = errorDescription;
    this._additionalDetails = additionalDetails;
  }

  public static emptyError() {
    return new ApiError(null, null, null, false);
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

  set additionalDetails(value: any) {
    this._additionalDetails = value;
  }

  get error(): boolean {
    return this._error;
  }

  public static parseApiError(response: ApiResponse, callback: (apiError: ApiError) => void, translate: TranslateService) {
    let code = response.cause;
    let reason = code;
    if (response.localization) {
      translate.get(response.localization).subscribe((value: string) => {
        reason = value;
        callback(new ApiError(code, reason, response));
      });
      return;
    }
    callback(new ApiError(code, reason, response));
  }

}

export interface ApiResponse {
  status: boolean;
  cause: string;
  localization: string;
}

