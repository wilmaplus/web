import {Component, Input} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../../../../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import * as moment from "moment";
import {Reservation} from "../../../../../../../../client/types/schedule/reservation";
import {Md5} from "ts-md5";


@Component({
  selector: 'wilmaplus-schedule-reservation',
  templateUrl: './reservation-element.component.html',
  styleUrls: ['./reservation-element.component.scss']
})


export class ReservationElement extends WilmaPlusAppComponent {

  @Input()
  reservation: Reservation | undefined

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet) {
    super(snackBar, router, titleService, translate, bottomSheet);
  }

  getFormattedTime(date: Date|null) {
    if (date == null)
      return undefined;
    return moment(date).format("HH:mm");
  }

  getCodeName() {
    if (this.reservation !== undefined) {
      let codes: any[] = [];
      this.reservation.groups.forEach((group) => {
        if (group.codeName)
          codes.push(group.codeName);
      });
      return codes.join(",");
    }
    return '';
  }

  getTeachers() {
    if (this.reservation !== undefined) {
      let teachers: any[] = [];
      this.reservation.groups.forEach((group) => {
        if (group.teachers) {
          group.teachers.forEach((teacher) => {
            if (teacher.name != null && !teachers.includes(teacher.name))
              teachers.push(teacher.name);
          })
        }
      });
      return teachers.join(", ");
    }
    return '';
  }

  getRooms() {
    if (this.reservation !== undefined) {
      let rooms: any[] = [];
      this.reservation.groups.forEach((group) => {
        if (group.rooms) {
          group.rooms.forEach((room) => {
            if (room.codeName != null && !rooms.includes(room.codeName))
              rooms.push(room.codeName);
          })
        }
      });
      return rooms.join(", ");
    }
    return '';
  }

  hashCode(content: string) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = content.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private static getContrastColor(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getLetterColor() {
    let colorRGB = ReservationElement.getContrastColor(this.getColorCode());
    if (colorRGB != null) {
      let sum = (colorRGB.r*299 + colorRGB.g*587+colorRGB.b*114)/1000;
      return sum >= 128 ? "#000" : "#fff";
    } else {
      return "#fff";
    }
  }

  groupToMD5() {
    if (this.reservation === undefined)
      return ""
    return new Md5().appendStr(String(this.reservation.groups[0].courseId)).end(false).toString();
  }

  intToRGB(number: number) {
    return "#"+((number)>>>0).toString(16).slice(-6);
  }

  getColorCode() {
    return this.intToRGB(this.hashCode(this.groupToMD5()));
  }


  getFullName() {
    if (this.reservation !== undefined) {
      let nameString = "";
      for (const { index, value } of this.reservation.groups.map((value, index) => ({ index, value }))) {
        if (index < this.reservation.groups.length-1) {
          nameString += value.name+", "
        } else if (index < this.reservation.groups.length-2)
          nameString += value.name +" ja"
        else if (index == this.reservation.groups.length-1)
          nameString += value.name;
      }
      return nameString;
    }
    return '';
  }

  isOngoing() {
    let now = moment();
    let beginTime = moment(this.reservation?.start);
    let endTime = moment(this.reservation?.end);
    return now.isAfter(beginTime) && now.isBefore(endTime);
  }
}
