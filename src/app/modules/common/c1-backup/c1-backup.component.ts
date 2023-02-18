import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { BackupService } from 'src/app/core/services/common/c1-backup.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { QuestionService } from 'src/app/core/services/features/f8-question.service';

@Component({
  selector: 'app-c1-backup',
  templateUrl: './c1-backup.component.html',
  styleUrls: ['./c1-backup.component.scss'],
})
export class C1BackupComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  /**
   * onCheckAllSelected
   */
  onCheckAllSelected() {
    this.isSelectAll = !this.isSelectAll;

    // check or uncheck all item
    for (let i = 0; i < this.dataSources.length; i++) {
      this.dataSources[i].checked = this.isSelectAll;
    }
  }

  /**
   *
   * @param id
   */
  onItemSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.dataSources.length; i++) {
      if (this.dataSources[i].id === id) {
        this.dataSources[i].checked = !this.dataSources[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getSelection() {
    return this.dataSources.filter((x) => x.checked);
  }

  /**
   *
   */
  onChangeSize() {
    // uncheck select all
    this.isSelectAll = false;

    // reset page index and load grid
    this.pageIndex = 1;
    this.onLoadDataGrid();
  }

  /**
   * onBeginClick
   */
  onBeginClick() {
    if (this.pageIndex > 1) {
      // uncheck select all
      this.isSelectAll = false;

      this.pageIndex = 1;
      this.onLoadDataGrid();
    }
  }

  /**
   * onPreviousClick
   */
  onPreviousClick() {
    if (this.pageIndex > 1) {
      // uncheck select all
      this.isSelectAll = false;

      this.pageIndex -= 1;
      this.onLoadDataGrid();
    }
  }

  /**
   * onNextClick
   */
  onNextClick() {
    const lastPage = Math.ceil(this.pageLength / this.pageSize);
    if (this.pageIndex < lastPage) {
      // uncheck select all
      this.isSelectAll = false;

      this.pageIndex += 1;
      this.onLoadDataGrid();
    }
  }

  /**
   * onEndClick
   */
  onEndClick() {
    const lastPage = Math.ceil(this.pageLength / this.pageSize);

    if (this.pageIndex < lastPage) {
      // uncheck select all
      this.isSelectAll = false;

      this.pageIndex = lastPage;
      this.onLoadDataGrid();
    }
  }

  /**
   * add New Condition To List
   * @param condition
   */
  addNewConditionToList(condition: any) {
    // check exists
    let flg = false;
    let i;

    // check condition exists
    for (i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i].key == condition.key) {
        flg = true;
        break;
      }
    }

    // remove old key
    if (flg) {
      this.conditions.splice(i, 1);
    }

    // insert new seach condition if !=0
    if (condition.value != '0') {
      this.conditions.splice(0, 0, condition);
    }

    // render new condition filter
    this.createConditionFilter();

    // load grid with new condition
    this.onLoadDataGrid();
  }

  /**
   * create Condition Filter
   */
  createConditionFilter() {
    this.conditonFilter = '';
    this.conditions.forEach((item) => {
      if (this.conditonFilter == '') {
        this.conditonFilter = item.key + '=' + item.value + '';
      } else {
        this.conditonFilter += '&' + item.key + '=' + item.value + '';
      }
    });

    if (this.conditonFilter != '') {
      this.conditonFilter = '&' + this.conditonFilter;
    }
  }
  /**
   * ****************** End for pagination ******************
   */

  // data reference binding
  dataSources: any[] = [];
  dataSourcesTemp: any[] = [];
  userDatas: any[] = [];
  questionDatas: any[] = [];

  // delete id
  restoreId: string;

  // model
  idFilterUserModel: any = '0';
  idFilterQuestionModel: any = '0';

  /**
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * @param commonService
   * @param api
   * @param userService
   * @param questionService
   */
  constructor(
    private commonService: CommonService,
    private api: BackupService,
    private userService: UserService,
    private questionService: QuestionService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );


    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data reference
    this.loadDataReference();

    // on load data grid
    this.onLoadDataGrid();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {}

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * updateRestoreId
   * @param id
   */
  updateRestoreId(id: string) {
    this.restoreId = id;
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    const filter = '';
    this.subscription.push(
      this.api
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditonFilter,
          fields: '',
        })
        .subscribe((data) => {
          this.dataSourcesTemp = data.results;
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
          this.isLoading$.next(false);
        })
    );
  }

  /**
   * load Data Reference
   */
  loadDataReference() {
    // get list user data
    this.getListUserDatas();

    // get list question data
    this.getListQuestionDatas();
  }

  /**
   * get list user datas
   */
  getListUserDatas() {
    // get data
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
      })
    );
  }

  /**
   * get list question datas
   */
  getListQuestionDatas() {
    // get data
    this.subscription.push(
      this.questionService.get().subscribe((data) => {
        this.questionDatas = data;
      })
    );
  }

  /**
   * getIdQuestionById
   * @param id
   */
  getQuestionById(id: string) {
    const result = this.questionDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].content;
    }
    return '';
  }

  /**
   * getUserById
   * @param id
   */
  getUserById(id: string) {
    const result = this.userDatas.find((item) => item._id == id);

    return result?.fullName || '';
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick(event: string) {
    const condition = { key: 'idEntity', value: event };

    // add new condition to list
    this.addNewConditionToList(condition);
  }

  /**
   * onRestoreBtnClick
   */
  onRestoreBtnClick() {
    // show loading
    this.isLoading$.next(true);
    this.subscription.push(
      this.api.restore(this.restoreId).subscribe(() => {
        this.commonService.showSuccess('Restore Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }

  /**
   * onBackupBtnClick
   */
  onBackupBtnClick() {
   // show loading
   this.isLoading$.next(true);

    this.subscription.push(
      this.api.backup().subscribe(() => {
        this.commonService.showSuccess('Backup Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }
}
