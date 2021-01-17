export class AsyncIterator {
  currentItem: number
  private _callback: (item: any, iterator: AsyncIterator) => void
  private _endCallback: () => void

  constructor(callback: (item: any, iterator: AsyncIterator) => void|null, endCallback: () => void|null, public items: any[]) {
    this.currentItem = -1;
    this._callback = callback;
    this._endCallback = endCallback;
  }


  set callback(value: (item: any) => void) {
    this._callback = value;
  }

  set endCallback(value: () => void) {
    this._endCallback = value;
  }

  nextItem() {
    if (this.currentItem+1 < this.items.length) {
      this.currentItem++;
      this._callback(this.items[this.currentItem], this);
    } else {
      this._endCallback()
    }
  }

}
