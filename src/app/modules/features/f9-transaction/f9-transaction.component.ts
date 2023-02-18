import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { TransactionService } from 'src/app/core/services/features/f9-transaction.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-f9-transaction',
  templateUrl: './f9-transaction.component.html',
  styleUrls: ['./f9-transaction.component.scss'],
})
export class F9TransactionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // Status transactions
  statusTransaction = {
    waiting: 'waiting',
    success: 'success',
    failure: 'failure',
  };

  // Method transactions
  methodTransaction = {
    transfers: 'transfers',
    momo: 'momo',
    viettelpay: 'viettelpay',
  };

  // Type transactions
  typeTransaction = {
    withdraw: 'withdraw',
    recharge: 'recharge',
  };

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
   * onItemSelected
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
   * onChangeSize
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
  addNewConditionToList(condition: any, isLoadData = true) {
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
    if (isLoadData) this.onLoadDataGrid();
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

  // data reference binding
  dataSources: any[] = [];
  dataSourcesTransaction: any[] = [];
  userDatas: any[] = [];

  // delete id
  deleteId: String;

  // model
  idFilterUserModel: any = '0';

  /**
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * @param commonService
   * @param api
   * @param userService
   */
  constructor(
    private commonService: CommonService,
    private api: TransactionService,
    private userService: UserService
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

    // on load data grid
    this.onLoadDataGrid();
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
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditonFilter,
          fields: 'idUser,statusTransaction,methodTransaction,typeTransaction,money,transactionImage',
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
    // get list user datas
    this.getListUserDatas();
  }

  /**
   * get list user datas
   */
  getListUserDatas() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
      })
    );
  }

  /**
   * getUserById
   * @param id
   */
  getUserById(id: string) {
    const result = this.userDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].fullName;
    }
    return '';
  }

  /**
   * onApplyBtnClick
   * @param event
   */
  onApplyBtnClick(event: string) {
    const condition = { key: 'idUser', value: event[0] };

    // add new condition to list
    this.addNewConditionToList(condition, false);

    const condition1 = { key: 'methodTransaction', value: event[1] };

    // add new condition to list
    this.addNewConditionToList(condition1, false);

    const condition2 = { key: 'statusTransaction', value: event[2] };

    // add new condition to list
    this.addNewConditionToList(condition2, false);

    const condition3 = { key: 'typeTransaction', value: event[3] };

    // add new condition to list
    this.addNewConditionToList(condition3);
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
   * onAcceptManyBtnClick
   */
  onAcceptManyBtnClick() {
    // get list money
    const moneySelect = +this.getSelection().map((item) => item.money);

    // get idUser
    const idUserSelect = this.getSelection()
      .map((item) => item.idUser)
      .toString();

    const arrayTemp = this.getSelection().filter(
      (item) =>
        item.statusTransaction == 'waiting' &&
        item.typeTransaction == 'recharge'
    ); //waiting

    // get list id select
    const listIdSelect = arrayTemp.map((item) => item.id).join(',');

    if (listIdSelect != '') {
      this.subscription.push(
        this.api.rechargeMoney(moneySelect, idUserSelect).subscribe(() => {
          this.commonService.showSuccess('Accept Success!');
          // load new data
          this.onLoadDataGrid();
        })
      );
    } else {
      this.commonService.showWarning('No approval required!');
    }
  }

  /**
   * onWithDrawManyBtnClick
   */
  onWithDrawManyBtnClick() {
    // get list money
    const moneySelect = +this.getSelection().map((item) => item.money);

    // get idUser
    const idUserSelect = this.getSelection()
      .map((item) => item.idUser)
      .toString();

    // arrayTemp
    const arrayTemp = this.getSelection().filter(
      (item) =>
        item.statusTransaction == 'waiting' &&
        item.typeTransaction == 'withdraw'
    );

    // get list id select
    const listIdSelect = arrayTemp.map((item) => item.id).join(',');

    if (listIdSelect != '') {
      this.subscription.push(
        this.api.withdrawMoney(moneySelect, idUserSelect).subscribe(() => {
          this.commonService.showSuccess('With Draw Success!');
          // load new data
          this.onLoadDataGrid();
        })
      );
    } else {
      this.commonService.showWarning('No approval required!');
    }
  }
}
