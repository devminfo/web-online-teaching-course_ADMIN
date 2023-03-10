import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'test-question-filter',
  templateUrl: './test-question-filter.component.html',
})
export class TestQuestionFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() testQuestions: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<string>();

  // binding
  testQuestionSelect: string = '0';

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
    this.applyBtnClick.emit(this.testQuestionSelect);
  }
}
