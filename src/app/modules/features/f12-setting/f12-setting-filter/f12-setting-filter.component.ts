import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'f12-setting-filter',
  templateUrl: './f12-setting-filter.component.html',
})
export class F12SettingFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() questions: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  questionSelect: string = '0';

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
    this.applyBtnClick.emit(this.questionSelect);
  }
}
