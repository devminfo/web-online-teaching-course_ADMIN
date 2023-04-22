import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'transaction-filter',
  templateUrl: './transaction-filter.component.html',
})
export class TransactionFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() transactions: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  transactionSelect: string = '0';

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
    this.applyBtnClick.emit(this.transactionSelect);
  }
}
