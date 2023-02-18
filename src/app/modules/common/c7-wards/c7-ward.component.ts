import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { WardService } from 'src/app/core/services/common/c7-wards.service';

@Component({
  selector: 'app-c7-ward',
  templateUrl: './c7-ward.component.html',
  styleUrls: ['./c7-ward.component.scss'],
})
export class C7WardComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  filterString = '';

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
  constructor(private commonService: CommonService, private api: WardService) {
    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });
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
   * ****************** End for pagination ******************
   *
  /

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.getWards();
  }

  /**
   * load Data Reference
   */
  loadDataReference() {}

  /**
   * Get data userSpecializes
   */
  getWards() {
    this.subscription.push(
      this.api
        .paginate({
          filter: this.filterString,
          page: this.pageIndex,
          limit: this.pageSize,
          fields: '',
          populate: 'idProvince,idDistrict',
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
    this.filterString = '';

    if (event.idProvince !== '0')
      this.filterString = `&idProvince=${event.idProvince}`;

    if (event.idDistrict !== '0')
      this.filterString = `&${this.filterString}&idDistrict=${event.idDistrict}`;

    console.log(this.filterString);

    // add new condition to list
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
   * on SubSpecialize Selection Change
   * @param event
   */
  onUserSelectionChange(event: any) {
    const condition = { key: 'idUser', value: event.value };

    this.addNewConditionToList(condition);
  }
}
