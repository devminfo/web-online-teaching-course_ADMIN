import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
  selector: 'app-b2-tab-user-in-group',
  templateUrl: './b2-tab-user-in-group.component.html',
})
export class B8TabUserInGroupComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // input data source for select
  @Input() groupId: string;

  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // Init data source temp for search
  usersInGroupTemp: any[] = [];
  usersInGroup: any[] = [];
  removeUserFromGroupId: any;

  /**
   * constructor
   *
   * @param api
   * @param common
   */
  constructor(private api: GroupService, private common: CommonService) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
  }

  /**
   *
   */
  ngOnInit(): void {
    this.onLoadUsersInGroup();
  }

  /**
   * ****************** Begin for users pagination ******************
   */
  isUsersSelectedAll = false;
  usersPageIndex = 1;
  usersPageLength = 0;
  usersPageSize = 5;
  usersPageSizeOptions: number[] = [10, 20, 50, 100];

  /**
   * onCheckAllSelected
   */
  onCheckAllUsersSelected() {
    this.isUsersSelectedAll = !this.isUsersSelectedAll;

    // check or uncheck all item
    for (let i = 0; i < this.usersInGroup.length; i++) {
      this.usersInGroup[i].checked = this.isUsersSelectedAll;
    }
  }

  /**
   *
   * @param id
   */
  onUsersSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.usersInGroup.length; i++) {
      if (this.usersInGroup[i].id === id) {
        this.usersInGroup[i].checked = !this.usersInGroup[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getUsersSelection() {
    return this.usersInGroup.filter((x) => x.checked);
  }

  /**
   *
   */
  onUsersChangeSize() {
    // uncheck select all
    this.isUsersSelectedAll = false;

    // reset page index and load grid
    this.usersPageIndex = 1;
    this.onLoadUsersInGroup();
  }

  /**
   * onBeginClick
   */
  onUsersBeginClick() {
    if (this.usersPageIndex > 1) {
      // uncheck select all
      this.isUsersSelectedAll = false;

      this.usersPageIndex = 1;
      this.onLoadUsersInGroup();
    }
  }

  /**
   * onPreviousClick
   */
  onUsersPreviousClick() {
    if (this.usersPageIndex > 1) {
      // uncheck select all
      this.isUsersSelectedAll = false;

      this.usersPageIndex -= 1;
      this.onLoadUsersInGroup();
    }
  }

  /**
   * onNextClick
   */
  onUsersNextClick() {
    const lastPage = Math.ceil(this.usersPageLength / this.usersPageSize);
    if (this.usersPageIndex < lastPage) {
      // uncheck select all
      this.isUsersSelectedAll = false;

      this.usersPageIndex += 1;
      this.onLoadUsersInGroup();
    }
  }

  /**
   * onEndClick
   */
  onUsersEndClick() {
    const lastPage = Math.ceil(this.usersPageLength / this.usersPageSize);

    if (this.usersPageIndex < lastPage) {
      // uncheck select all
      this.isUsersSelectedAll = false;

      this.usersPageIndex = lastPage;
      this.onLoadUsersInGroup();
    }
  }
  /**
    * ****************** End for users pagination ******************


  // condition fillter
  conditonGroupAPiFilter: string = '';
  conditionsGroupAPi: any[] = [];

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
   * onLoad users in group
   */
  onLoadUsersInGroup() {
    this.subscription.push(
      this.api
        .getUsersInGroup({
          groupId: this.groupId,
          page: this.usersPageIndex,
          limit: this.usersPageSize,
          fields: 'fullName,avatar,born,role,gender,address',
          filter: '',
        })
        .subscribe((data) => {
          this.usersInGroup = data.results;
          this.usersPageLength = data.totalResults;
          this.usersInGroupTemp = this.usersInGroup;
        })
    );
  }

  /**
   * Search
   * @param keyword
   */
  onSearchChange(keyword: any) {
    this.usersInGroup = this.usersInGroupTemp.filter((data) =>
      data.fullName
        ? data.fullName.toLowerCase().includes(keyword.toLowerCase())
        : true
    );

    this.usersPageLength = this.usersInGroup.length;
  }

  /**
   * Remove user from group
   * @param id
   */
  removeUserFromGroup(id: string) {
    this.removeUserFromGroupId = id;
  }

  /**
   * Remove user from group
   */
  onRemoveOneUserFromGroupClick() {
    this.subscription.push(
      this.api
        .updateUsers(this.groupId, {
          users: [this.removeUserFromGroupId],
          options: 'delete',
        })
        .subscribe(
          () => {
            this.common.showSuccess('Delete Success!');

            // load new data
            this.onLoadUsersInGroup();
          },
          (error: any) => {
            this.common.showError(`Delete failure! ${error.message}`);

            // load new data
            this.onLoadUsersInGroup();
          }
        )
    );
  }

  /**
   * Remove many user from group
   */
  onDeleteManyUsersFromGroupBtnClick() {
    // get list users id selected
    const listUsersIdRemoveFromGroup = this.getUsersSelection().map(
      (user: any) => user._id
    );

    // delete many by list id select
    this.subscription.push(
      this.api
        .updateUsers(this.groupId, {
          options: 'delete',
          users: listUsersIdRemoveFromGroup,
        })
        .subscribe(
          () => {
            this.common.showSuccess('Delete Success!');

            // load new data
            this.onLoadUsersInGroup();
          },
          (error: any) => {
            this.common.showError(`Delete failure! ${error.message}`);

            // load new data
            this.onLoadUsersInGroup();
          }
        )
    );
  }
}
