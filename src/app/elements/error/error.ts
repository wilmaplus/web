import {Component, Input} from "@angular/core";
import {ApiError} from "../../client/types/base";

@Component({
  selector: 'wilmaplus-error',
  templateUrl: './error.html',
  styleUrls: ['./error.scss']
})

export class WilmaPlusErrorCard {

  @Input()
  apiError: ApiError = ApiError.emptyError()

  @Input()
  retry: (() => void) | undefined

  triggerRetry() {
    if (this.retry !== undefined)
      this.retry();
  }

}
