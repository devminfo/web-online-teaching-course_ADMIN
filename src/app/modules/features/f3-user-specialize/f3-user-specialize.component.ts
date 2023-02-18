import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { SpecializeService } from 'src/app/core/services/features/f1-specialize.service';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';
import { UserSpecializeService } from 'src/app/core/services/features/f3-user-specialize.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-f3-user-specialize',
  templateUrl: './f3-user-specialize.component.html',
  styleUrls: ['./f3-user-specialize.component.scss'],
})
export class F3UserSpecializeComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
  dataSourcesSpecializes: any[] = [];
  dataSourcesUsers: any[];
  // delete id
  deleteId: String;

  /**
   * constructor
   *
   * @param commonService
   * @param userService
   * @param api
   * @param apiSubSpecialize
   */
  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private api: UserSpecializeService,
    private apiSubSpecialize: SubSpecializeService
  ) {
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

    // check data reference loaded
    this.observable.subscribe((data) => {
      // number api reference call
      if (data == 2) {
        // load data user
        this.onLoadDataGrid();
      }
    });
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
  }

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
    this.getUserSpecializes();
  }

  /**
   * load Data Reference
   */
  loadDataReference() {
    this.getSubSpecializes();
    this.getUsers();
  }

  /**
   * Get data userSpecializes
   */
  getUserSpecializes() {
    this.subscription.push(
      this.api
        .paginate({
          filter: this.conditonFilter,
          page: this.pageIndex,
          limit: this.pageSize,
          fields: 'idUser,idSubSpecializes,helpYou,suggestedTopic',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

  /**
   * Get references Specializes
   */
  getSubSpecializes() {
    this.subscription.push(
      this.apiSubSpecialize.get().subscribe((data) => {
        this.dataSourcesSpecializes = data;

        // loading finished
        this.call += 1;
        this.observer.next(this.call);
      })
    );
  }

  /**
   * Get references users
   */
  getUsers() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.dataSourcesUsers = data;

        // loading finished
        this.call += 1;
        this.observer.next(this.call);
      })
    );
  }

  /**
   * Get Specialize By Id
   * @param id
   */
  getSpecializeById(id: string) {
    const result = this.dataSourcesSpecializes.find((item) => item._id == id);

    return result?.name || '';
  }

  /**
   * Get User By Id
   * @param id
   */
  getUserById(id: string) {
    const result = this.dataSourcesUsers.find((item) => item._id == id);
    return result?.fullName || '';
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
  onApplyBtnClick(event: string) {
    const condition = { key: 'idUser', value: event };

    // add new condition to list
    this.addNewConditionToList(condition);
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
   * on SubSpecialize Selection Change
   * @param event
   */
  onUserSelectionChange(event: any) {
    const condition = { key: 'idUser', value: event.value };

    this.addNewConditionToList(condition);
  }
}
