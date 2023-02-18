import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreModuleService } from 'src/app/core/services/features/f15-store-module.service';

@Component({
  selector: 'app-f15-store-module',
  templateUrl: './f15-store-module.component.html',
  styleUrls: ['./f15-store-module.component.scss'],
})
export class F15StoreModuleComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  storeData: any[] = [];
  groupServicesData: any[] = [];

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
   * Constructor
   * @param commonService
   * @param api
   */
  constructor(
    private commonService: CommonService,
    private api: StoreModuleService
  ) {}

  /**
   * ng On Init
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();
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

      // reset page index and load grid
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

      // reset page index and load grid
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

      // reset page index and load grid
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

      // reset page index and load grid
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
