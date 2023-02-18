import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { HistoryQuizService } from 'src/app/core/services/features/f7-historyquiz.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { CertificateService } from 'src/app/core/services/features/f5-certificate.service';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-f7-historyquiz',
  templateUrl: './f7-historyquiz.component.html',
  styleUrls: ['./f7-historyquiz.component.scss'],
})
export class F7HistoryQuizComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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

  // data reference binding
  dataSources: any[] = [];
  dataSourcesHistoryQuiz: any[] = [];
  idUserDatas: any[] = [];
  idCertificateDatas: any[] = [];

  // delete id
  deleteId: String;

  // model
  idFilterUserModel: any = '0';
  idFilterCertificateModel: any = '0';

  /**
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * @param commonService
   * @param api
   * @param apiHistoryQuiz
   * @param userService
   * @param certificateService
   */
  constructor(
    private commonService: CommonService,
    private api: HistoryQuizService,
    private apiHistoryQuiz: HistoryQuizService,
    private userService: UserService,
    private certificateService: CertificateService
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

    // load data grid
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
          fields: 'idUser,idCertificate,point,totalPoint',
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
    // get list user data
    this.getListUserDatas();

    // get list certificate data
    this.getListCertificateDatas();
  }

  /**
   * get list user data
   */
  getListUserDatas() {
    // get idUserDatas
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.idUserDatas = data;
      })
    );
  }

  /**
   * get list certificate data
   */
  getListCertificateDatas() {
    // get data idCertificateDatas
    this.subscription.push(
      this.certificateService.get().subscribe((data) => {
        this.idCertificateDatas = data;
      })
    );
  }

  /**
   * getCertificateById
   * @param id
   */
  getCertificateById(id: string) {
    const result = this.idCertificateDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].title;
    }
    return '';
  }

  /**
   * getUserById
   * @param id
   */
  getUserById(id: string) {
    const result = this.idUserDatas.filter((item) => item._id == id);

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
  onApplyBtnClick(filter: { idUser: string; idCertificate: string }) {
    let query = '';
    for (const [key, value] of Object.entries(filter)) {
      if (value !== '0') query += `&${key}=${value}`;
    }
    this.conditonFilter = query;

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
}
