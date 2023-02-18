import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoreSService } from 'src/app/core/services/features/f14-store-services.service';

@Component({
  selector: 'app-f18-store-services-template',
  templateUrl: './f18-store-services-template.component.html',
  styleUrls: ['./f18-store-services-template.component.scss'],
})
export class F18StoreServicesTemplateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  groupServicesData: any[] = [];
  checkData: boolean;

  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  // condition filter
  conditionFilter: string = 'sort=-createdAt';

  // data source for grid
  dataSources: any[] = [];

  // delete id
  deleteId: String;

  /**
   * constructor
   * @param commonService
   * @param api
   * @param storeService
   * @param groupService
   */
  constructor(
    private commonService: CommonService,
    private api: StoreSService,
    private groupService: GroupSService
  ) {}

  /**
   * ng OnInit
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();

    // load group service
    this.getGroupServices();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
  }

  /**
   * ng On Destroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * get Group Service
   */
  getGroupServices() {
    this.groupService.get().subscribe((data) => {
      this.groupServicesData = data;
    });
  }

  /**
   * get Group Service By Id
   * @param id
   * @returns
   */
  getGroupServiceById(id: string) {
    const result = this.groupServicesData.filter((item) => item._id == id);
    // check exists
    if (result.length > 0) {
      return result[0].title;
    }
    return '';
  }

  /**
   * on apply btn click
   * @param data
   */
  onFilterBtnClick(event: any) {
    let query = '';
    // check value filter
    for (const [key, value] of Object.entries(event)) {
      if (value !== '0') query += `&${key}=${value}`;
    }
    this.conditionFilter = query;
    this.onLoadDataGrid();
  }

  /**
   * on Check All Selected
   */
  onCheckAllSelected() {
    this.isSelectAll = !this.isSelectAll;

    // check or uncheck all item
    for (let i = 0; i < this.dataSources.length; i++) {
      this.dataSources[i].checked = this.isSelectAll;
    }
  }

  /**
   *on Item Selected
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
   * get Selection
   * @returns
   */
  getSelection() {
    return this.dataSources?.filter((x) => x.checked) || 0;
  }

  /**
   *on Change Size
   */
  onChangeSize() {
    // uncheck select all
    this.isSelectAll = false;

    // reset page index and load grid
    this.pageIndex = 1;
    this.onLoadDataGrid();
  }

  /**
   * on Begin Click
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
   * on Previous Click
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
   * on Next Click
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
   * on End Click
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
          fields: '',
          populate: '',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

  /**
   * update Delete By Id
   * @param id
   */
  updateDeleteById(id: String) {
    this.deleteId = id;
  }

  /**
   * on Delete Btn Click
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
   * on Delete Many Btn Click
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
   * on Search Change
   * @param keyword
   */
  onSearchChange(keyword: String) {
    let filterStr = '';
    if (keyword) {
      filterStr = `filter={"$or":[{"title":"${keyword}"}]}`;
    }
    this.conditionFilter = `sort=-createdAt&${filterStr}`;

    this.onLoadDataGrid();
  }
}
