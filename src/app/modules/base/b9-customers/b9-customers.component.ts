import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { StoreService } from 'src/app/core/services/features/store.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-b9-customers',
  templateUrl: './b9-customers.component.html',
  styleUrls: ['./b9-customers.component.scss'],
})
export class B9CustomersComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];

  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  // condition filter
  conditionFilter: string = '';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[];
  roles: string[];
  stores: string[];

  // delete id
  deleteId: String;

  // user
  user: any;

  // typeUserDatas
  typeUserDatas: any[] = [
    { value: '1', viewValue: 'CUSTOMER' },
    { value: '2', viewValue: 'STAFF' },
    { value: '3', viewValue: 'WORKER' },
    { value: '4', viewValue: 'TABLET' },
  ]

  /**
   * constructor
   * @param commonService 
   * @param api 
   * @param storeService 
   * @param authService 
   */
  constructor(private commonService: CommonService,
    private api: UserService,
    private storeService: StoreService,
    private authService: AuthService
  ) { }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();

    // load all roles
    this.onLoadAllRoles();

    // load all store
    this.onLoadAllStores();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
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
    return this.dataSources?.filter((x) => x.checked) || 0;
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
  addNewConditionToList(condition: any, isLoadData = true) {
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
    if (isLoadData) this.onLoadDataGrid();
  }

  /**
   * create Condition Filter
   */
  createConditionFilter() {
    this.conditionFilter = '';
    this.conditions.forEach((item) => {
      if (this.conditionFilter == '') {
        this.conditionFilter = item.key + '=' + item.value + '';
      } else {
        this.conditionFilter += '&' + item.key + '=' + item.value + '';
      }
    });

    if (this.conditionFilter != '') {
      this.conditionFilter = '&' + this.conditionFilter;
    }
  }

  /**
   * ****************** End for pagination ******************
   */

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    const auth = this.authService.getAuthFromLocalStorage();
    auth?.user.email != 'admin@gmail.com'
      ? (this.conditionFilter += `&idStore=${auth?.user.idStore}`)
      : this.conditionFilter;

    this.subscription.push(
      this.api
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter + '&sort=-createdAt&isDeleted=false',
          populate: 'idStore',
          fields: '',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

  /**
   * On load all roles
   */
  onLoadAllRoles() {
    this.subscription.push(
      this.api.get(`fields=role`).subscribe((data: any) => {
        this.roles = [...new Set(<string[]>data.map((user: any) => user.role))];
      })
    );
  }

  /**
  * On load all stores
  */
  onLoadAllStores() {
    this.subscription.push(
      this.storeService.get().subscribe((data: any) => {
        this.stores = data;
      })
    );
  }

  /**
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    this.deleteId = id;
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
   * on apply btn click
   * @param event
   */
  onApplyBtnClick(event: any) {
    const condition = { key: 'role', value: event[0] };

    // add new condition to list
    this.addNewConditionToList(condition, false);

    const condition1 = { key: 'idStore', value: event[1] };

    // add new condition to list
    this.addNewConditionToList(condition1, false);

    const condition2 = { key: 'typeUser', value: event[2] };

    // add new condition to list
    this.addNewConditionToList(condition2);
  }

  /**
   * onSearchChange
   * @param keyword
   */
  onSearchChange(keyword: String) {
    let filterStr = '';
    if (keyword)
      filterStr = `filter={"$or":[{"email":"${keyword}"},{"fullName":"${keyword}"},{"phone":"${keyword}"}]}`;
    this.conditionFilter = `sort=createdAt&${filterStr}`;

    this.onLoadDataGrid();
  }
}
