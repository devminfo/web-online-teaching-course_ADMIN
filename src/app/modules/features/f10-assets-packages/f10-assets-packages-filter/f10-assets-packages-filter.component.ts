import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
@Component({
  selector: 'app-f10-assets-packages-filter',
  templateUrl: './f10-assets-packages-filter.component.html',
})
export class F10AssetsPackagesFilterComponent implements OnInit {

  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() dataType : any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  typeSelect: string = '0';
  
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
      type: this.typeSelect,
    };
    this.applyBtnClick.emit(data);
  }
}
