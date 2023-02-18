import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'f2-sub-specialize-filter',
  templateUrl: './f2-sub-specialize-filter.component.html',
})
export class F2SubSpecializeFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() specializes: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  specializeSelect: string = '0';

  /**
   * constructor
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit(this.specializeSelect);
  }
}
