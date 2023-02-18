import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-f13-group-services-filter',
  templateUrl: './f13-group-services-filter.component.html',
  styleUrls: ['./f13-group-services-filter.component.scss']
})
export class F13GroupServicesFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() stores: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  storeSelect: string = '0';
  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
  }

  /**
   * onApplyBtnClick
   */
  onFilterBtnClick() {
    this.applyBtnClick.emit(this.storeSelect);
  }

}
