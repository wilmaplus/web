import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, ViewChild} from "@angular/core";
import {WilmaPlusAppComponent} from "../../../../../../wilma-plus-app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TranslateService} from "@ngx-translate/core";
import {AuthApi} from "../../../../../../authapi/auth_api";
import {ApiClient} from "../../../../../../client/apiclient";
import {ScheduleDay} from "../../../../../../client/types/schedule/schedule_day";
import * as moment from 'moment';
import {MiscUtils} from "../../../../../../utils/misc";

@Component({
  selector: 'wilmaplus-tab-schedule',
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.scss']
})


export class ScheduleTab extends WilmaPlusAppComponent {
  loading = true;
  schedule: ScheduleDay[] = []
  schedule_ui_text = {
    translationRes: '',
    params: {}
  }
  @Input("userHeader") userHeader: HTMLDivElement | undefined
  height:any = 'auto'
  private translateProvider:TranslateService
  titleUpdaterTimeout: number = 0

  @ViewChild('scheduleHeader', {read: ElementRef, static:false}) listView: ElementRef | undefined;

  constructor(snackBar: MatSnackBar, router: Router, titleService: Title, translate: TranslateService, bottomSheet: MatBottomSheet, private authApi: AuthApi, private apiClient: ApiClient, private chRef: ChangeDetectorRef) {
    super(snackBar, router, titleService, translate, bottomSheet);
    this.translateProvider = translate;
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.authApi.getSelectedAccountWithCorrectUrl(accountModel => {
      if (accountModel !== undefined) {
        let weekForwardTimestamp = Date.now() + (6.048e+8 * 2);
        this.apiClient.getScheduleInRange(new Date(), new Date(weekForwardTimestamp), accountModel, schedule => {
          this.loading = false;
          this.schedule = schedule.schedule;
          this.updateUI();
        }, error => {
          this.loading = false;
          console.log(error);
          // Re-login is handled by homepage, so tab is being silent while homepage re-logins.
          if (error.reLogin)
            return;
          this.openError(error, () => {this.loadSchedule()});
        })
      } else
        this.loading = false;
    }, error => {
      this.loading = false;
      console.log(error);
      this.openError(error, () => {this.loadSchedule()});
    })
  }

  updateUI() {
    if (this.titleUpdaterTimeout > 0)
      clearInterval(this.titleUpdaterTimeout);
    this.titleUpdaterTimeout = setInterval(() => {this.getHeaderTitle()}, 1000)
    this.getHeaderTitle();
  }

  getCurrentListOfLessons(removeExpiredItems: boolean = true) {
    let now = moment();
    let finalList = [];
    // This hack creates a new "instance" of schedule, to not reference main variable, which should be intact in its original state.
    const scheduleCopy = JSON.parse(JSON.stringify(this.schedule));
    for (let scheduleDay of scheduleCopy) {
      let finalReservations = [];
      let realCount = 0;
      for (let reservation of scheduleDay.reservations) {
        if (reservation.start !== null && reservation.end !== null) {
          let endDate = moment(reservation.end);
          if (now.isBefore(endDate)) {
            finalReservations.push(reservation);
            realCount++;
          } else if (!removeExpiredItems)
            finalReservations.push(reservation);
        }
      }
      if (realCount > 0) {
        scheduleDay.reservations = finalReservations;
        finalList.push(scheduleDay);
      }
    }
    if (finalList.length > 0) {
      for (let item of finalList) {
        if (moment().isBefore(moment(item.date))) {
          return item;
        }
      }
    }
    return {reservations: [], date: null};
  }

  /**
   * Calculates proper height for list
   */
  fixListHeight() {
    if (this.listView !== undefined && this.userHeader !== undefined && this.userHeader.parentElement !== undefined) {
      // @ts-ignore
      let heightCalc = this.userHeader?.parentElement?.clientHeight-this.userHeader?.clientHeight-this.listView.nativeElement.offsetParent.offsetParent.parentElement.firstChild.clientHeight-this.listView.nativeElement.clientHeight;
      this.height = heightCalc-8-19+'px'; // 8 is padding of title, and 19 padding of main card
      console.log(this.height);
      this.chRef.detectChanges();
    }
  }



  getHeaderTitle() {
    let lessonLists = this.getCurrentListOfLessons(false);
    if (lessonLists.reservations.length < 1) {
      this.schedule_ui_text.translationRes = 'no_items_near_future';
      this.schedule_ui_text.params = {};
    } else {
      let draftParams = {
        count: lessonLists.reservations.length,
        multiple: '',
        time: ''
      }
      let draftRes = 'lesson_count';
      let today = moment();
      let tomorrow = moment();
      tomorrow.add(1, 'day');
      if (today.isSame(lessonLists.date, 'day')) {
        // @ts-ignore
        let scheduleDayDetails = ScheduleTab.getCurrentDayDetails(lessonLists);
        if (scheduleDayDetails != null) {
          if (!scheduleDayDetails.schoolStarted) {
            let startOfDay = moment(scheduleDayDetails.length.startOfDay);
            let diffInHours = startOfDay.diff(today, 'hours');
            if (diffInHours <= 5) {
              this.schedule_ui_text.translationRes = 'school_starts';
              this.schedule_ui_text.params = {
                time: MiscUtils.millisecondsToStr(startOfDay.unix()-today.unix())
              }
            } else
              this.applyDateHeader('today', draftParams, lessonLists, draftRes);
          } else {
            let endOfDay = moment(scheduleDayDetails.length.endOfDay);
            if (scheduleDayDetails.ongoing) {
              if (scheduleDayDetails.realReservations.length < 2) {
                this.schedule_ui_text.translationRes = 'school_ends';
                this.schedule_ui_text.params = {
                  time: MiscUtils.millisecondsToStr(endOfDay.unix()-today.unix())
                }
              } else {
                let reservation = scheduleDayDetails.realReservations[0];
                let resEnd = moment(reservation.end);
                this.schedule_ui_text.translationRes = 'lesson_ends';
                this.schedule_ui_text.params = {
                  time: MiscUtils.millisecondsToStr(resEnd.unix()-today.unix())
                }
              }
            } else if (scheduleDayDetails.realReservations.length > 0) {
              let reservation = scheduleDayDetails.realReservations[0];
              let resStart = moment(reservation.start);
              this.schedule_ui_text.translationRes = 'lesson_starts';
              this.schedule_ui_text.params = {
                time: MiscUtils.millisecondsToStr(resStart.unix()-today.unix())
              }
            }
          }
        } else {
          this.applyDateHeader('today',draftParams, lessonLists, draftRes);
        }
      } else if (tomorrow.isSame(lessonLists.date, 'day')) {
        this.applyDateHeader('tomorrow', draftParams, lessonLists, draftRes);
      }
    }
  }

  private applyDateHeader(dateKey: string, draftParams: any, lessonLists: any, draftRes: any) {
    this.translateProvider.get(dateKey).subscribe((value) => {
      draftParams.time = value;
      if (lessonLists.reservations.length > 1) {
        this.translateProvider.get('schedule_multiple').subscribe((value2) => {
          draftParams.multiple = value2;
          this.schedule_ui_text.params = draftParams;
          this.schedule_ui_text.translationRes = draftRes;
        });
      } else {
        this.schedule_ui_text.params = draftParams;
        this.schedule_ui_text.translationRes = draftRes;
      }
    });
  }

  private static getScheduleDayFullLength(scheduleDay: ScheduleDay) {
    let startOfDay: Date|null = null;
    let endOfDay: Date|null = null;
    if (scheduleDay.reservations.length > 0) {
      let startRes = scheduleDay.reservations[0];
      let endRes = scheduleDay.reservations[scheduleDay.reservations.length-1];
      if (startRes.start !== null && endRes.end !== null) {
        startOfDay = moment(startRes.start).toDate();
        endOfDay = moment(endRes.end).toDate();
      }
    }
    return {startOfDay, endOfDay};
  }

  private static getCurrentDayDetails(scheduleDay: ScheduleDay) {
    let now = moment();
    let length = ScheduleTab.getScheduleDayFullLength(scheduleDay);
    if (length.startOfDay != null && length.endOfDay != null) {
      let schoolStarted = now.isAfter(moment(length.startOfDay));
      let schoolEnded = now.isAfter(moment(length.endOfDay));
      let realReservations = [];
      let ongoing = false;
      for (let reservation of scheduleDay.reservations) {
        if (reservation.start !== null && reservation.end !== null) {
          let endDate = moment(reservation.end);
          let startDate = moment(reservation.start);
          if (now.isBefore(endDate)) {
            if (now.isAfter(startDate))
              ongoing = true;
            realReservations.push(reservation);
          }
        }
      }
      return {schoolStarted, schoolEnded, scheduleDay, realReservations, length, ongoing};
    }
    return null;
  }

  ngOnDestroy() {
    clearInterval(this.titleUpdaterTimeout);
  }
}
