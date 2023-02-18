import { F10AssetsPackagesService } from 'src/app/core/services/features/f10-assets-packages.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { F1StoresService } from 'src/app/core/services/features/f1-stores.service';
import { F11StorePackageTransactionsService } from 'src/app/core/services/features/f11-store-package-transactions.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-f11-store-package-transactions',
  templateUrl: './f11-store-package-transactions.component.html',
  styleUrls: ['./f11-store-package-transactions.component.scss'],
})
export class F11StorePackageTransactionsComponent implements OnInit, OnDestroy {
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
  dataAssetPackage: any[] = [];

  //dataSuccess
  transactionStatusSuccess: any = {
    transactionStatus: 'SUCCESS',
  };

  //dataFailure
  transactionStatusFailure: any = {
    transactionStatus: 'FAILURE',
  };

  //dataMethod
  dataMethod: any = [
    {
      id: 'TRANSFER',
      value: 'Bank Transfer',
    },
    {
      id: 'PAYPAL',
      value: 'Paypal',
    },
  ];

  //dataStatus
  dataStatus: any = [
    { id: 'CHECKING', value: 'Checking' },
    { id: 'SUCCESS', value: 'Success' },
    { id: 'FAILURE', value: 'Failure' },
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
    public commonService: CommonService,
    private storePackageTransactionsService: F11StorePackageTransactionsService,
    private storeService: F1StoresService,
    private assetPackageService: F10AssetsPackagesService,
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

    // load data user
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
      this.storePackageTransactionsService
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields:
            '_id,idAssetPackage,idStore,type,quantity,price,transactionStatus,transactionMethod,transactionImage',
          populate: 'idAssetPackage,idStore',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
  }

  /**
   * loadDataReference
   */
  loadDataReference() {
    this.getStore();
    this.getAssetPackage();
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
    return this.dataSources.filter((x) => x.checked);
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
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    this.deleteId = id;
  }

  /**
   * onApplyBtnClick
   * @param event
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
        ['idAssetPackage.title', 'idStore.name'],
        keyword
      );
      this.pageLength = this.dataSources.length;
    } else {
      this.onLoadDataGrid();
    }
  }

  /**
   * onChangeStatusSuccessBtnClick
   */
  onChangeStatusSuccessBtnClick() {
    //check if == checkking được đổi trạng thái
    const arrayTemp = this.getSelection().filter(
      (item) => item.transactionStatus == 'CHECKING'
    );

    // get list id select
    const listIdSelect = arrayTemp.map((item) => item.id).join(',');

    // check if không bằng failed
    if (listIdSelect != '') {
      // get list id select
      this.getSelection().map((item) => {
        this.subscription.push(
          this.storePackageTransactionsService
            .update(item._id, this.transactionStatusSuccess)
            .subscribe(() => {
              this.onLoadDataGrid();
            })
        );
      });
      this.commonService.showSuccess('Change Status Success!');
    } else {
      this.commonService.showWarning('No approval required!');
    }
  }

  /**
   * onChangeStatusFailureBtnClick
   */
  onChangeStatusFailureBtnClick() {
    //check if == checkking được đổi trạng thái
    const arrayTemp = this.getSelection().filter(
      (item) => item.transactionStatus == 'CHECKING'
    );

    // get list id select
    const listIdSelect = arrayTemp.map((item) => item.id).join(',');

    // check if không bằng failed
    if (listIdSelect != '') {
      // get list id select
      this.subscription.push(
        this.storePackageTransactionsService
          .update(listIdSelect, this.transactionStatusFailure)
          .subscribe(() => {
            this.onLoadDataGrid();
          })
      );
      this.commonService.showSuccess('Change Status Failure!');
    } else {
      this.commonService.showWarning('No approval required!');
    }
  }

  /**
   * getStore
   */
  getStore() {
    this.subscription.push(
      this.storeService.get().subscribe((data) => {
        this.dataStore = data;
      })
    );
  }

  /**
   * getAssetPackage
   */
  getAssetPackage() {
    this.subscription.push(
      this.assetPackageService.get().subscribe((data) => {
        this.dataAssetPackage = data;
      })
    );
  }
}
