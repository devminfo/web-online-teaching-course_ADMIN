import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'f4-subject-filter',
  templateUrl: './f4-subject-filter.component.html',
})
export class F4SubjectFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() subjects: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  subjectSelect: string = '0';

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
    this.applyBtnClick.emit(this.subjectSelect);
  }
}
