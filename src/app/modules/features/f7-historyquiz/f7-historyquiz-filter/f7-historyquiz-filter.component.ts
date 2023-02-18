import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'f7-historyquiz-filter',
  templateUrl: './f7-historyquiz-filter.component.html',
})
export class F7HistoryQuizFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() certificates: any[] = [];
  @Input() users: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<{
    idUser: string;
    idCertificate: string;
  }>();

  // binding
  certificateSelect: string = '0';
  userSelect: string = '0';

  /**
   * constructor
   */
  constructor() {}

  /**
   * ngOnInit
   */
  ngOnInit(): void {}

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit({
      idUser: this.userSelect,
      idCertificate: this.certificateSelect,
    });
  }
}
