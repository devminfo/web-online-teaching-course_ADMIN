import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'f9-transaction-filter',
  templateUrl: './f9-transaction-filter.component.html',
})
export class F9TransactionFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() users: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  userSelect: string = '0';

  // methodTransaction
  methodTransaction: any[] = [
    { value: 'transfers', name: 'Chuyển khoản' },
    { value: 'momo', name: 'Ví Momo' },
    { value: 'viettelpay', name: 'Viettel Pay' },
  ];

  methodSelect: string = '0';

  // statusTransaction
  statusTransaction: any[] = [
    { value: 'waiting', name: 'Chờ duyệt' },
    { value: 'success', name: 'Thành công' },
    { value: 'failure', name: 'Thất bại' },
  ];

  statusSelect: string = '0';

  // typeTransaction
  typeTransaction: any[] = [
    { value: 'recharge', name: 'Nạp tiền' },
    { value: 'withdraw', name: 'Rút tiền' },
  ];

  typeSelect: string = '0';

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
    const param = [
      this.userSelect,
      this.methodSelect,
      this.statusSelect,
      this.typeSelect,
    ];
    this.applyBtnClick.emit(param);
  }
}
