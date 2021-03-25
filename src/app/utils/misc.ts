import {DomSanitizer} from "@angular/platform-browser";
import {AccountTypes} from "../authapi/account_types";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

export class MiscUtils {
  public static b64toBlob(b64Data: string, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  public static getBase64Image(imageString: string, _sanitizer: DomSanitizer) {
    let blob = URL.createObjectURL(MiscUtils.b64toBlob(imageString));
    return _sanitizer.bypassSecurityTrustUrl(blob);
  }

  public static getCurrentDateAndTime(translateService: TranslateService) {
    moment.locale(translateService.currentLang || translateService.defaultLang);
    let now = moment();
    return now.format("dddd L");
  }

  public static getType(type: number) {
    switch (type) {
      case AccountTypes.GUARDIANS: {
        return 'guardian';
      }
      case AccountTypes.LEADERS: {
        return 'leaders';
      }
      case AccountTypes.STAFF: {
        return 'staff';
      }
      case AccountTypes.STUDENT: {
        return 'student';
      }
      case AccountTypes.TEACHER: {
        return 'teacher';
      }
      case AccountTypes.WORKPLACE_INSTRUCTOR: {
        return 'work_instructor';
      }
      default: {
        return 'account';
      }
    }
  }

  public static millisecondsToStr (temp: number) {

    let days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      return days + ' d';
    }
    let hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return hours + ' h' ;
    }
    let minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return minutes +1+ ' min';
    }
    let seconds = temp % 60;
    if (seconds) {
      return seconds + ' s';
    }
    return '< 1s';
  }
}
