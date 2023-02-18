import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
@Component({
  selector: 'app-b2-users',
  templateUrl: './b2-users.component.html',
  styleUrls: ['./b2-users.component.scss'],
})
export class B2UsersComponent implements OnInit, AfterViewInit, OnDestroy {
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
  conditionFilter: string = 'sort=createdAt';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[];
  roles: string[];

  // delete id
  deleteId: String;

  /**
   * constructor
   * @param api
   * @param commonService
   */
  constructor(private commonService: CommonService, private api: UserService) {}

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();

    // load all roles
    this.onLoadAllRoles();
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
   * ****************** End for pagination ******************
   */

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.subscription.push(
      this.api
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          populate: '',
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
   * @param role
   */
  onApplyBtnClick(role: any) {
    if (role == '0') this.conditionFilter = `sort=createdAt`;
    else this.conditionFilter = `sort=createdAt&role=${role}`;

    this.onLoadDataGrid();
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
