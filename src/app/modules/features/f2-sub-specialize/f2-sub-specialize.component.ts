import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SpecializeService } from 'src/app/core/services/features/f1-specialize.service';

@Component({
  selector: 'app-f2-sub-specialize',
  templateUrl: './f2-sub-specialize.component.html',
  styleUrls: ['./f2-sub-specialize.component.scss'],
})
export class F2SubSpecializeComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

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

  // data source for grid
  dataSources: any[] = [];
  dataSourcesSpecialize: any[] = [];

  // delete id
  deleteId: String;

  /**
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * @param api
   * @param dialog
   */
  constructor(
    private commonService: CommonService,
    private api: SubSpecializeService,
    private apiSpecialize: SpecializeService
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
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    this.deleteId = id;
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    const filter = '';
    this.subscription.push(
      this.api
        .paginate(this.pageIndex, this.pageSize, this.conditonFilter)
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

  /**
   * load Data Reference
   */
  loadDataReference() {
    this.subscription.push(
      this.apiSpecialize.get().subscribe((data) => {
        this.dataSourcesSpecialize = data;

        // loading finished
        this.call += 1;
        this.observer.next(this.call);
      })
    );
  }

  /**
   * getSpecializeById
   * @param id
   */
  getSpecializeById(id: string) {
    const result = this.dataSourcesSpecialize.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].name;
    }
    return '';
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick(event: string) {
    const condition = { key: 'idSpecialize', value: event };

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
}
