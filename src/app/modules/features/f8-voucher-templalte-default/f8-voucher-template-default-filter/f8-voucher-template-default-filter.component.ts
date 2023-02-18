import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
@Component({
  selector: 'app-f8-voucher-template-default-filter',
  templateUrl: './f8-voucher-template-default-filter.component.html',
})
export class F8VoucherTemplateDefaultFilterComponent  implements OnInit {

  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() dataUnitTypeDiscount : any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  unitTypeDiscountSelect: string = '0';
  
  /**
   * constructor
   */
  constructor() {}

  /**
   *ngOnInit
   */
  ngOnInit(): void {}

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    const data = {
      UnitTypeDiscount: this.unitTypeDiscountSelect,
    };
    this.applyBtnClick.emit(data);
  }
}
