import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { F10AssetsPackagesService } from 'src/app/core/services/features/f10-assets-packages.service';
@Component({
  selector: 'app-f10-assets-packages',
  templateUrl: './f10-assets-packages.component.html',
  styleUrls: ['./f10-assets-packages.component.scss'],
})
export class F10AssetsPackagesComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;
  isClickEnded: boolean = false;
  isClickHapping: boolean = false;
  isClickUpcoming: boolean = false;
  // condition fillter
  conditionFilter: string = '';
  conditions: any[] = [];
  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  url = './assets/media/svg/files/delete.svg';
  // data source for grid
  dataSources: any[] = [];
  dataAssetsPackages: any[] = [];
  //dataUnitTypeDiscount
  dataType = ([] = [
    {
      id: 'SMS',
      value: 'SMS',
    },
    {
      id: 'VOICE',
      value: 'Voice',
    },
    {
      id: 'MMS',
      value: 'MMS',
    },
  ]);
  // delete id
  deleteId: String;
  /**
   * Constructor
   *
   * @param commonService
   * @param api
   * @param apiSubSpecialize
   */
  constructor(
    public commonService: CommonService,
    private assetsPackage: F10AssetsPackagesService
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
      if (data == 1) {
        // load data user
        this.onLoadDataGrid();
      }
    });
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
   * load Data Reference
   */
  loadDataReference() {
    this.onLoadDataGrid();
  }
  /**
   *onLoadDataGrid
   */
  onLoadDataGrid() {
    this.subscription.push(
      this.assetsPackage
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields: '_id,unitType,title,quantity,originalPrice,price,type',
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
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    console.log(id)
    this.deleteId = id;
  }
  /**
   * onDeleteBtnClick
   */
  onDeleteBtnClick() {
    this.subscription.push(
      this.assetsPackage.delete(this.deleteId).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }
  /**
   * onDeleteManyBtnClick
   */
  onBtnDeleteManyClick() {
    // get list id select
    const listIdSelect = this.getSelection()
      .map((item) => item.id)
      .join(',');
    // delete many by list id select
    this.subscription.push(
      this.assetsPackage.deleteManyByIds(listIdSelect).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadDataGrid();
      })
    );
  }
  /**
   * onApplyBtnClick
   * @param data
   */
  onApplyBtnClick(data: any) {
    this.conditionFilter = '';
    // dieu kien loc
    if (data.type !== '0') {
      this.conditionFilter = `&type=${data.type}`;
    }
    this.onLoadDataGrid();
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
  /**
   * formatPrice
   * @param e
   * @returns
   */
  formatPrice(e: any) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(e);
  }
}