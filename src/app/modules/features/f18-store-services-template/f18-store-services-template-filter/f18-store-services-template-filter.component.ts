import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-f18-store-services-template-filter',
  templateUrl: './f18-store-services-template-filter.component.html',
  styleUrls: ['./f18-store-services-template-filter.component.scss']
})
export class F18StoreServicesTemplateFilterComponent implements OnInit {
  subscription: Subscription[] = [];
  @Input() groupServices: any[] = [];

  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // output
  @Output() applyBtnClick = new EventEmitter<object>();

  // binding
  groupSelect: string = '0';

  /**
   * constructor
   */
  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit(): void { }

  /**
   * onFilterBtnClick
   */
  onFilterBtnClick() {
    const values = {
      idGroupService: this.groupSelect,
    };
    this.applyBtnClick.emit(values);
  }
}
