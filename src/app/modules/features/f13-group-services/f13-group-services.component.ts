import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoresService } from 'src/app/core/services/features/stores.service';

@Component({
  selector: 'app-f13-group-services',
  templateUrl: './f13-group-services.component.html',
  styleUrls: ['./f13-group-services.component.scss']
})
export class F13GroupServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  storeData: any[] = [];

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
   */
  constructor(private commonService: CommonService,
    private api: GroupSService,
    private storeService: StoresService
  ) { }

  /**
   * ngOnInit
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
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * getStores
   */
  getStores() {
    this.storeService.get().subscribe(data => {
      this.storeData = data;
    })
  }

  /**
   * onFilterBtnClick
   */
  onFilterBtnClick(idStore: any) {
    if (idStore == '0') {
      this.conditionFilter = `sort=createdAt`;
    }
    else {
      this.conditionFilter = `sort=createdAt&idStore=${idStore}`;
    }

    this.onLoadDataGrid();
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
   *onItemSelected
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
   *onChangeSize
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
    // load data stores
    this.getStores();

    this.subscription.push(
      this.api
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields: ''
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
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
   * onSearchChange
   * @param keyword 
   */
  onSearchChange(keyword: string) {
    if (keyword != '') {
      this.dataSources = this.commonService.onSearchKeyWordReturnArray(
        this.dataSources,
        ['title'],
        keyword
      );
      this.pageLength = this.dataSources.length;
    } else {
      this.onLoadDataGrid();
    }
  }

}
