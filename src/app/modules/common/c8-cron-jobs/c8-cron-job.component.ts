import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CronJobService } from 'src/app/core/services/common/c8-cron-job.service';
import { F13StoreTemplatesService } from 'src/app/core/services/features/f13-store-templates.service';
import { StoreService } from 'src/app/core/services/features/store.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-c8-cron-job',
  templateUrl: './c8-cron-job.component.html',
  styleUrls: ['./c8-cron-job.component.scss'],
})
export class C8CronJobComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // Begin for pagination
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  // data source for grid
  dataSources: any[] = [];
  userDatas: any[] = [];
  storeDatas: any[] = [];
  storeTemplateDatas: any[] = [];

  // delete id
  deleteId: String;

  restoreParam: any;

  // isLoadRestoreParam
  isLoadRestoreParam$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoadRestoreParam: boolean;

  /**
   * constructor
   * @param commonService 
   * @param api 
   * @param userService 
   * @param storeService 
   * @param storeTemplateService 
   */
  constructor(
    private commonService: CommonService,
    private api: CronJobService,
    private userService: UserService,
    private storeService: StoreService,
    private storeTemplateService: F13StoreTemplatesService
  ) {
    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });

    this.subscription.push(
      this.isLoadRestoreParam$
        .asObservable()
        .subscribe((res) => (this.isLoadRestoreParam = res))
    );
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.onLoadDataGrid();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void { }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * ****************** End for pagination ******************
   *
  /

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    // load data reference
    this.loadDataReference();

    // get cron job
    this.getCronJob();
  }

  /**
   * load Data Reference
   */
  loadDataReference() {
    // get list user
    this.getListUser();

    // get list store
    this.getListStore();

    // get list store template
    this.getListStoreTemplate();
  }

  /**
   * getListUser
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
      })
    );
  }

  /**
  * getUserById
  * @param id
  */
  getUserById(id: string) {
    const result = this.userDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].fullName;
    }
    return '';
  }

  /**
   * getListStore
   */
  getListStore() {
    this.subscription.push(
      this.storeService.get().subscribe((data) => {
        this.storeDatas = data;
      })
    );
  }

  /**
  * getStoreById
  * @param id
  */
  getStoreById(id: string) {
    const result = this.storeDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].name;
    }
    return '';
  }

  /**
  * getListStoreTemplate
  */
  getListStoreTemplate() {
    this.subscription.push(
      this.storeTemplateService.get().subscribe((data) => {
        this.storeTemplateDatas = data;
      })
    );
  }

  /**
  * getStoreTemplateById
  * @param id
  */
  getStoreTemplateById(id: string) {
    const result = this.storeTemplateDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].title;
    }
    return '';
  }



  /**
   * Get data cronJob
   */
  getCronJob() {
    this.subscription.push(
      this.api
        .paginate({
          filter: this.conditonFilter,
          page: this.pageIndex,
          limit: this.pageSize,
          fields: 'startDateTime,status,entityType,idEntity,cronJobKey,restoreParam',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

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
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    this.deleteId = id;
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick(event: any) {
    let query = '';
    for (const [key, value] of Object.entries(event)) {
      if (value !== '0') query += `&${key}=${value}`;
    }
    this.conditonFilter = query;
    this.onLoadDataGrid();
  }

  /**
   * onDeleteBtnClick
   */
  onDeleteBtnClick() {
    this.subscription.push(
      this.api.delete(this.deleteId).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }

  /**
   * onDeleteManyBtnClick
   */
  onDeleteManyBtnClick() {
    // get list id select
    const listIdSelect = this.getSelection()
      .map((item) => item.id)
      .join(',');

    // delete many by list id select
    this.subscription.push(
      this.api.deleteManyByIds(listIdSelect).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }

  /**
   * getDataRestoreParam
   */
  getDataRestoreParam(id: string) {
    this.subscription.push(
      this.api.find(id).subscribe((data) => {
        this.restoreParam = data.restoreParam.feedbackReview;
        this.isLoadRestoreParam$.next(true);
      })
    );
  }

  /**
   * onCloseModelRestoreParam
   */
  onCloseModelRestoreParam() {
    this.isLoadRestoreParam$.next(false);
    this.restoreParam = {};
  }
}
