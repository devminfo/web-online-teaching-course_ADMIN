import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-f14-store-services-filter',
  templateUrl: './f14-store-services-filter.component.html',
  styleUrls: ['./f14-store-services-filter.component.scss'],
})
export class F14StoreServicesFilterComponent implements OnInit {
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
      idGroupService: this.groupSelect,
    };
    this.applyBtnClick.emit(values);
  }
}
