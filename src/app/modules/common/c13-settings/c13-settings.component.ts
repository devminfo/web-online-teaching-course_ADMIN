import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { C13SettingService } from 'src/app/core/services/common/c13-setting.service';

@Component({
  selector: 'app-c13-settings',
  templateUrl: './c13-settings.component.html',
  styleUrls: ['./c13-settings.component.scss'],
})
export class C13SettingsComponent implements OnInit, OnDestroy {
  // subscription

  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;

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

  // delete id
  deleteId: String;

  /**
   * Constructor
   *
   * @param commonService
   * @param api
   * @param apiSubSpecialize
   */
  constructor(private settingService: C13SettingService) {
    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
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
    this.subscription.push(
      this.settingService
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: '',
          fields:
            'logo,timeZoneServer,timeZoneApp,accountName,accountNumber,bankName,bankBranch',
          populate: '',
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;
        })
    );
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
}
