import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { F5ServiceOrdersService } from 'src/app/core/services/features/f5-service-orders.service';
import { F1StoresService } from 'src/app/core/services/features/f1-stores.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-f5-service-orders',
  templateUrl: './f5-service-orders.component.html',
  styleUrls: ['./f5-service-orders.component.scss'],
})
export class F5ServiceOrdersComponent implements OnInit, OnDestroy {
  // subscription

  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

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

  // data source for grid
  dataSources: any[] = [];
  dataStore: any[] = [];
  dataStatus: any[] = [
    { id: 'ORDER', value: 'Order' },
    { id: 'CHECKING_IN', value: 'Check-in' },
  ];
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
    private commonService: CommonService,
    private serviceOrderService: F5ServiceOrdersService,
    private storesService: F1StoresService,
    private authService: AuthService
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
    //loadDataReference
    this.loadDataReference();

    // onLoadDataGrid
    this.onLoadDataGrid();
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
   *onLoadDataGrid
   */
  onLoadDataGrid() {
    const auth = this.authService.getAuthFromLocalStorage();
    auth?.user.email != 'admin@gmail.com'
      ? (this.conditionFilter += `&idStore=${auth?.user.idStore}`)
      : this.conditionFilter;

    this.subscription.push(
      this.serviceOrderService
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields:
            '_id,idStore,selectedServices,idCustomer,status,dateTimeCheckIn',
          populate: 'idStore,idCustomer,selectedServices.idStoreService',
        })
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
    this.getStore();
  }

  /**
   * getStore
   */
  getStore() {
    this.subscription.push(
      this.storesService.get().subscribe((data) => {
        this.dataStore = data;
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
   * onApplyBtnClick
   * @param data
   */
  onApplyBtnClick(event: any) {
    let query = '';

    //chạy vòng lặp tìm giá trị id và value
    for (const [key, value] of Object.entries(event)) {
      //nếu giá trị value khác 0 thì lọc
      if (value !== '0') query += `&${key}=${value}`;
    }
    this.conditionFilter = query;
    this.onLoadDataGrid();
  }

  /**
   * onSearchChange
   * @param keyword
   */
  onSearchChange(keyword: string) {
    //nếu tồn tại keyword
    if (keyword != '') {
      this.dataSources = this.commonService.onSearchKeyWordReturnArray(
        this.dataSources,
        ['idCustomer.phone'],
        keyword
      );
      this.pageLength = this.dataSources.length;
    } else {
      this.onLoadDataGrid();
    }
  }
}
