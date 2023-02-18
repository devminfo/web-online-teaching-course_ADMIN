import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'f11-reviews-filter',
  templateUrl: './f11-reviews-filter.component.html',
})
export class F11ReviewsFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() users: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  userSelect: string = '0';

  /**
   * constructor
   */
  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit(): void {

  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit(this.userSelect);
  }
}
