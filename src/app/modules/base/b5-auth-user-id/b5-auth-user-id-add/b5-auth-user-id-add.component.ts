import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { AuthUserIdAPIService } from 'src/app/core/services/base/b5-auth-user-id.service';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
  selector: 'auth-user-id-add',
  templateUrl: './b5-auth-user-id-add.component.html',
  styleUrls: ['./b5-auth-user-id-add.component.scss'],
})
export class B5AuthUserIdAddComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 500;
  pageSizeOptions: number[] = [10, 20, 50, 100, 500];

  listReferIds: string[];
  referId: string;
  newB5AuthUserIdItem: any;

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
   * ****************** End for pagination ******************
   */

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[];
  dataSourcesTemp: any[];
  authUserAccessDataSources: any[];

  // delete id
  deleteId: String;

  keyword: string = '';
  lastKeyword: string = '';

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    private commonService: CommonService,
    private api: GroupAPIService,
    private groupDetailService: GroupDetailService,
    private authUserIdService: AuthUserIdAPIService
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
   * load Data Reference
   */
  loadDataReference() {
    this.subscription.push(
      this.authUserIdService.get().subscribe((data) => {
        this.authUserAccessDataSources = data;

        // loading finished
        this.call += 1;
        this.observer.next(this.call);
      })
    );
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.getDataSources();
  }

  /**
   * Get auth user access
   */
  getDataSources() {
    this.subscription.push(
      this.api.get().subscribe((data) => {
        let groupApis = data;
        let isExists = false;
        let results = [];

        // remove app exists free api in groups api
        for (let i = 0; i < groupApis.length; i += 1) {
          isExists = false;

          // if api not in
          for (let j = 0; j < this.authUserAccessDataSources.length; j++) {
            // access methods and url
            if (
              this.compareAccessMethod(
                groupApis[i].accessMethods,
                this.authUserAccessDataSources[j].accessMethods
              ) &&
              groupApis[i].url == this.authUserAccessDataSources[j].url
            ) {
              isExists = true;
              break;
            }
          }

          // Add to list if not exists
          if (!isExists) {
            // revome method if exists in free api
            const filter = this.authUserAccessDataSources.filter(x => x.url == groupApis[i].url)[0];
            if (filter) {
              const accessMethods = filter.accessMethods;
              accessMethods.forEach((item: any) => {
                // check exists and remove
                var index = groupApis[i].accessMethods.indexOf(item);
                if (index !== -1) {
                  groupApis[i].accessMethods.splice(index, 1);
                }
              });
            }
            results.push(groupApis[i]);
          }
        }

        this.dataSources = results;
        this.dataSourcesTemp = results;
        this.pageLength = data.length;
      })
    );
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGridHaveKeyword() {
    // load new free api
    this.subscription.push(
      this.authUserIdService.get().subscribe((data) => {
        this.authUserAccessDataSources = data;

        // group api 
        const filter = '';
        this.subscription.push(
          this.api.get().subscribe((data) => {
            let groupApis = data;
            let isExists = false;
            let results = [];

            // remove app exists free api in groups api
            for (let i = 0; i < groupApis.length; i += 1) {
              isExists = false;

              // if api not in
              for (let j = 0; j < this.authUserAccessDataSources.length; j++) {
                // access methods and url
                if (
                  this.compareAccessMethod(
                    groupApis[i].accessMethods,
                    this.authUserAccessDataSources[j].accessMethods
                  ) &&
                  groupApis[i].url == this.authUserAccessDataSources[j].url
                ) {
                  isExists = true;
                  break;
                }
              }

              // Add to list if not exists
              if (!isExists) {
                // revome method if exists in free api
                const filter = this.authUserAccessDataSources.filter(x => x.url == groupApis[i].url)[0];
                if (filter) {
                  const accessMethods = filter.accessMethods;
                  accessMethods.forEach((item: any) => {
                    // check exists and remove
                    var index = groupApis[i].accessMethods.indexOf(item);
                    if (index !== -1) {
                      groupApis[i].accessMethods.splice(index, 1);
                    }
                  });
                }
                results.push(groupApis[i]);
              }
            }

            this.dataSources = results;
            this.dataSourcesTemp = results;

            // update value with seach key word
            this.dataSources = this.dataSourcesTemp.filter((data) =>
              data.url.includes(this.keyword)
            );
            this.pageLength = this.dataSources.length;
          })
        );
      })
    );
  }

  /**
   * compareAccessMethod
   * @param accessA
   * @param accessB
   * @returns
   */
  compareAccessMethod(accessA: [], accessB: []) {
    // Return if length not match
    if (accessA.length != accessB.length) {
      return false;
    }

    // Check all item A in B
    for (let i = 0; i < accessA.length; i += 1) {
      if (!accessB.includes(accessA[i])) {
        return false;
      }
    }

    return true;
  }

  /**
  * onSearchChange
  * @param keyword
  */
  onSearchChange(keyword: string) {
    // trim space
    keyword = keyword.replace(/ /g, '');
    this.keyword = keyword;

    // tìm theo url
    this.dataSources = this.dataSourcesTemp.filter((data) =>
      data.url.includes(keyword)
    );

    // nếu không search theo url được thì search theo tên
    if (this.dataSources.length == 0) {
      this.dataSources = this.dataSourcesTemp.filter((data) =>
        data.collectionName.includes(keyword)
      );
    }

    this.pageLength = this.dataSources.length;
  }

  /**
   * onBtnAddClick
   * @param method
   * @param data
   */
  onBtnAddClick(method: String, data: any) {
    const param = {
      accessMethods: [method],
      url: data.url,
      collectionName: data.collectionName,
    };
    // reset referIds
    this.listReferIds = [];
    this.referId = '';
    this.newB5AuthUserIdItem = {};

    this.subscription.push(
      this.groupDetailService
        .getCollectionKey(param.collectionName)
        .subscribe((data) => {
          // save referIds
          this.listReferIds = data;
          this.newB5AuthUserIdItem = param;
        })
    );
  }

  /**
   * Accept create authUserId
   */
  onAcceptAddB5AuthUserId() {
    const data = {
      referId: this.referId,
      ...this.newB5AuthUserIdItem,
    };

    this.subscription.push(
      this.authUserIdService.add(data).subscribe((data) => {
        this.commonService.showSuccess(
          'Add URL: "' +
          data.url +
          '" with METHOD: [' +
          data.method +
          '] Success...'
        );

        // remove item from list
        this.onLoadDataGridHaveKeyword();
      })
    );
  }

  /**
   * onBtnReloadClick
   */
  onBtnReloadClick() {
    // Clear keyword
    this.keyword = '';

    // Load data grid
    this.onLoadDataGrid();
  }
}
