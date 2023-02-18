import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { F8VoucherTemplateDefaultService } from 'src/app/core/services/features/f8-voucher-template-default.service';

@Component({
  selector: 'app-f8-voucher-template-default',
  templateUrl: './f8-voucher-template-default.component.html',
})
export class F8VoucherTemplateDefaultComponent implements OnInit, OnDestroy {
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
  dataSourceVoucherTemplateDefault: any[] = [];

  //dataUnitTypeDiscount
  dataUnitTypeDiscount = ([] = [
    {
      id: 'MONEY',
      value: 'Discount by money',
    },
    {
      id: 'PERCENT',
      value: 'Percent discount',
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
    private voucherTemplateDefault: F8VoucherTemplateDefaultService
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
    //onLoadDataGrid
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
      this.voucherTemplateDefault
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields: '_id,thumbnail,title,code,unitTypeDiscount,percentDiscount,priceDiscount',
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
   * onDeleteBtnClick
   */
  onDeleteBtnClick() {
    this.subscription.push(
      this.voucherTemplateDefault.delete(this.deleteId).subscribe(() => {
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
      this.voucherTemplateDefault
        .deleteManyByIds(listIdSelect)
        .subscribe(() => {
          this.commonService.showSuccess('Delete Success!');

          // load new data
          this.onLoadDataGrid();
        })
    );
  }

  /**
   * onBtnHasEndedDataClick
   */
  onBtnHasEndedDataClick() {
    this.isClickEnded = !this.isClickEnded;
    this.conditionFilter = '';

    // has click filter has ended data
    if (this.isClickEnded) {
      const date = new Date();
      const newDateHasEnded = new Date(date).toLocaleString('en-US');
      const convertDate = new Date(
        this.commonService.convertDateDDMMYYYYToYYYYMMDDHHMMSS(newDateHasEnded)
      ).getTime();
      this.conditionFilter = `&endDateTime<${convertDate}`;
    }

    this.onLoadDataGrid();
  }

  /**
   * onClickHappingData
   */
  onBtnHappingDataClick() {
    this.isClickHapping = !this.isClickHapping;
    this.conditionFilter = '';

    // has click filter has Happing data
    if (this.isClickHapping) {
      let date = new Date();
      const newDateHasEnded = new Date(date).toLocaleString('en-US');
      const convertDate = new Date(
        this.commonService.convertDateDDMMYYYYToYYYYMMDDHHMMSS(newDateHasEnded)
      ).getTime();
      this.conditionFilter = `&startDateTime<=${convertDate}&endDateTime>=${convertDate}`;
    }
    this.onLoadDataGrid();
  }

  /**
   * onClickUpcomingData
   */
  onBtnUpcomingDataClick() {
    this.isClickUpcoming = !this.isClickUpcoming;
    this.conditionFilter = '';

    // has click filter has UpComing data
    if (this.isClickUpcoming) {
      let date = new Date();
      const newDateHasEnded = new Date(date).toLocaleString('en-US');
      const convertDate = new Date(
        this.commonService.convertDateDDMMYYYYToYYYYMMDDHHMMSS(newDateHasEnded)
      ).getTime();
      this.conditionFilter = `&startDateTime>${convertDate}`;
    }
    this.onLoadDataGrid();
  }

  /**
   * onApplyBtnClick
   * @param data
   */
  onApplyBtnClick(data: any) {
    this.conditionFilter = '';

    // nếu giá trị khác bằng 0 thì lọc
    if (data.UnitTypeDiscount !== '0') {
      this.conditionFilter = `&unitTypeDiscount=${data.UnitTypeDiscount}`;
    }
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
        ['title'],
        keyword
      );
      this.pageLength = this.dataSources.length;
    } else {
      this.onLoadDataGrid();
    }
  }
}
