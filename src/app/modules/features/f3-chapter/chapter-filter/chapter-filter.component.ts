import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'chapter-filter',
  templateUrl: './chapter-filter.component.html',
})
export class ChapterFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() courses: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  courseSelect: string = '0';

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
    this.applyBtnClick.emit(this.courseSelect);
  }
}
