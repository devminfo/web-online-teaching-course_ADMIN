import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
@Component({
  selector: 'app-b7-group-detail',
  templateUrl: './b7-group-detail.component.html',
  styleUrls: ['./b7-group-detail.component.scss'],
})
export class B7GroupDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];

  /**
   * ****************** Begin for pagination ******************
   */
  isSelectAll = false;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 100;
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
   * ****************** End for pagination ******************
   */

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[] = [];

  // delete id
  deleteId: String;

  id: any;
  currentIdParent: string = '0';
  newIdParent: string = '0';
  dataSourcesParent: any[] = [];

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    private commonService: CommonService,
    private api: GroupDetailService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();

    // load data parent
    this.onLoadDataParentMenu();
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
    const filter = '&sort=position&populate=childs';
    this.subscription.push(
      this.api
        .getMenuOfCurrentUser(this.pageIndex, this.pageSize, filter)
        .subscribe((response) => {
          const results = this.api.handleDataMenus(response);

          // clear grid
          this.dataSources = [];

          // format data source
          for (let i = 0; i < results.length; i++) {
            this.dataSources.push(results[i]);

            // add if exists data
            if (results[i].childs.length > 0) {
              this.dataSources.push(...results[i].childs);
            }
          }
          this.pageLength = this.dataSources.length;
        })
    );
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
   * onLoadDataParentMenu
   */
  onLoadDataParentMenu() {
    // load all other parent
    const filter = '&sort=position&isChild=false&isGroup=true';
    this.subscription.push(
      this.api.paginate(1, 99, filter).subscribe((data) => {
        this.dataSourcesParent = data.results;
      })
    );
  }

  /**
   * onMoveManyBtnClick
   */
  onMoveManyBtnClick() {
    // get list id select
    const listIdSelect = this.getSelection().map((item) => item._id);

    // get all parent id for remove
    const filter = '&childs=' + listIdSelect.join(',');
    this.subscription.push(
      this.api.paginate(1, 99, filter).subscribe((data) => {
        let results = [...data.results];

        // if exists parent
        if (results.length > 0) {
          // create childs
          const childs = {
            childs: [...listIdSelect],
          };

          // let removes = [this.api.removeChild(item._id, childs)];
          let removes = results.map((item) =>
            this.api.removeChild(item._id, childs)
          );

          // remove all id in parent
          forkJoin(removes).subscribe((datas) => {
            // add all ids to new parent
            if (this.newIdParent != '0') {
              // create childs
              const childs = {
                childs: [...listIdSelect],
              };

              // Add new childs
              this.subscription.push(
                this.api.addChild(this.newIdParent, childs).subscribe(() => {
                  this.commonService.showSuccess('Update Group sucesss ^.<');
                  this.onLoadDataGrid();
                })
              );
            } else {
              this.commonService.showSuccess('Update Group sucesss ^.<');
              this.onLoadDataGrid();
            }
          });
        } else {
          // nếu đang thuộc main menu thì add vào group mới luôn
          // add all ids to new parent
          if (this.newIdParent != '0') {
            // create childs
            const childs = {
              childs: [...listIdSelect],
            };

            // Add new childs
            this.subscription.push(
              this.api.addChild(this.newIdParent, childs).subscribe(() => {
                this.commonService.showSuccess('Update Group sucesss ^.<');
                this.onLoadDataGrid();
              })
            );
          }
        }
      })
    );
  }

  /**
   * On reset all btn click
   */
  onResetAllBtnClick() {
    this.subscription.push(
      this.userService.resetAuthorization().subscribe((data) => {
        this.auth.logout();
        document.location.reload();
      })
    );
  }

  /**
   * On reset all btn click
   */
  onRegenerateBtnClick() {
    this.subscription.push(
      this.api.regenerate().subscribe((data) => {
        // load new data
        this.onLoadDataGrid();
      })
    );
  }
}
