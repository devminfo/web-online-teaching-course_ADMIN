import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
})
export class CategoryFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() categorys: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  categorySelect: string = '0';

  /**
   * constructor
   */
  constructor() {}

  /**
   *
   */
  ngOnInit(): void {}

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit(this.categorySelect);
  }
}
