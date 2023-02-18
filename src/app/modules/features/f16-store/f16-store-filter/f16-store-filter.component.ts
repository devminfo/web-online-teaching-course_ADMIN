import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-f16-store-filter',
  templateUrl: './f16-store-filter.component.html',
  styleUrls: ['./f16-store-filter.component.scss']
})
export class F16StoreFilterComponent implements OnInit {
  subscription: Subscription[] = [];
  
  @Input() cityData: any[] = [];
  @Input() stateData: any[] = [];
  @Input() countryData: any[] = [];

  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // output
  @Output() applyBtnClick = new EventEmitter<object>();

  // binding
  citySelect: string = '0';
  stateSelect: string = '0';
  countrySelect: string = '0';

  /**
   * constructor
   */
  constructor() {}

  /**
   * ngOnInit
   */
  ngOnInit(): void {}

  /**
   * onFilterBtnClick
   */
  onFilterBtnClick() {
    const values = {
      city: this.citySelect,
      state: this.stateSelect,
      country: this.countrySelect
    };
    this.applyBtnClick.emit(values);
  }
}
