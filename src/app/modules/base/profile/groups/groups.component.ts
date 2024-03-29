import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { IconUserModel } from '../../../../template/partials';

@Component({
  selector: 'app-profile-groups',
  templateUrl: './groups.component.html',
})
export class ProfileGroupsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];

  userId: string;
  isSelectAll = false;
  pageLength = 0;

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

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[];

  // delete id
  leaveGroupId: string;

  /**
   * constructor
   * @param userService
   * @param groupService
   */
  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private commonService: CommonService
  ) {}

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data user
    this.onLoadDataGrid();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
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
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.subscription.push(
      this.userService
        .getMe({ fields: 'groups', populate: 'groups' })
        .subscribe((data) => {
          this.userId = data._id;
          this.dataSources = data.groups;
          this.pageLength = data.groups.length;
        })
    );
  }

  /**
   * Leave group id
   * @param id
   */
  onLeaveGroupId(id: string) {
    this.leaveGroupId = id;
  }

  /**
   * on leave group btn click
   */
  onLeaveGroupBtnClick() {
    this.subscription.push(
      this.groupService
        .updateUsers(this.leaveGroupId, {
          users: [this.userId],
          options: 'delete',
        })
        .subscribe(
          () => {
            this.commonService.showSuccess('Leave the group Success!');

            // load new data
            this.onLoadDataGrid();
          },
          (error: any) => {
            this.commonService.showError(
              `Leave the group failure! ${error.message}`
            );

            // load new data
            this.onLoadDataGrid();
          }
        )
    );
  }
}
