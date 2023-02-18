import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-b2-tab-add-user-to-group',
  templateUrl: './b2-tab-add-user-to-group.component.html',
})
export class B8TabAddUserToGroupComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // input data source for select
  @Input() groupId: string;

  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // Init data source temp for search
  usersTemp: any[] = [];
  users: any[] = [];
  addUserToGroupId: any;

  /**
   * constructor
   *
   * @param api
   * @param common
   */
  constructor(
    private api: GroupService,
    private router: Router,
    private common: CommonService,
    private userService: UserService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
  }

  /**
   *
   */
  ngOnInit(): void {
    this.onLoadUsers();
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
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].checked = this.isUsersSelectedAll;
    }
  }

  /**
   *
   * @param id
   */
  onUsersSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        this.users[i].checked = !this.users[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getUsersSelection() {
    return this.users.filter((x) => x.checked);
  }

  /**
   *
   */
  onUsersChangeSize() {
    // uncheck select all
    this.isUsersSelectedAll = false;

    // reset page index and load grid
    this.usersPageIndex = 1;
    this.onLoadUsers();
  }

  /**
   * onBeginClick
   */
  onUsersBeginClick() {
    if (this.usersPageIndex > 1) {
      // uncheck select all
      this.isUsersSelectedAll = false;

      this.usersPageIndex = 1;
      this.onLoadUsers();
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
      this.onLoadUsers();
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
      this.onLoadUsers();
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
      this.onLoadUsers();
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
  onLoadUsers() {
    this.subscription.push(
      this.api
        .getUsersInGroup({
          groupId: this.groupId,
          page: 0,
          limit: 100,
          fields: '_id',
          filter: 'role=manager',
        })
        .subscribe((data) => {
          let filter = 'role=manager';

          if (data.results)
            filter = filter.concat(
              `&_id!=${data.results.map((user: any) => user._id).join(',')}`
            );

          this.loadUsersIngoreUserInGroup({
            filter,
          });
        })
    );
  }

  /**
   * Load user ignore user in group
   * @param param0
   */
  loadUsersIngoreUserInGroup({ filter }: { filter: string }) {
    this.userService
      .paginate({
        page: this.usersPageIndex,
        limit: this.usersPageSize,
        fields: 'fullName,avatar,born,role,gender,address',
        filter,
      })
      .subscribe((data) => {
        this.users = data.results;
        this.usersPageLength = data.totalResults;
        this.usersTemp = this.users;
      });
  }

  /**
   * Search
   * @param keyword
   */
  onSearchChange(keyword: any) {
    this.users = this.usersTemp.filter((data) =>
      data.fullName
        ? data.fullName.toLowerCase().includes(keyword.toLowerCase())
        : true
    );

    this.usersPageLength = this.users.length;
  }

  /**
   * Add user to group
   * @param id
   */
  addUserToGroup(id: string) {
    this.addUserToGroupId = id;
  }

  /**
   * Add user to group
   */
  onAddOneUserToGroupClick() {
    console.log(this.addUserToGroupId);
    this.subscription.push(
      this.api
        .updateUsers(this.groupId, {
          users: [this.addUserToGroupId],
          options: 'add',
        })
        .subscribe(
          () => {
            this.common.showSuccess('Add Success!');
            this.router.navigate([`/features/groups/update/${this.groupId}`]);

            // Reload component
            this.router
              .navigateByUrl('/features/groups', {
                skipLocationChange: true,
              })
              .then(() => {
                this.router.navigate([
                  `/features/groups/update/${this.groupId}`,
                ]);
              });

            // load new data
            this.onLoadUsers();
          },
          (error: any) => {
            this.common.showError(`Add failure! ${error.message}`);

            // load new data
            this.onLoadUsers();
          }
        )
    );
  }

  /**
   * Remove many user from group
   */
  onAddManyUsersToGroupBtnClick() {
    // get list users id selected
    const listUsersId = this.getUsersSelection().map((user: any) => user._id);

    // delete many by list id select
    this.subscription.push(
      this.api
        .updateUsers(this.groupId, {
          options: 'add',
          users: listUsersId,
        })
        .subscribe(
          () => {
            this.common.showSuccess('Add Success!');

            // Reload component
            this.router
              .navigateByUrl('/features/groups', {
                skipLocationChange: true,
              })
              .then(() => {
                this.router.navigate([
                  `/features/groups/update/${this.groupId}`,
                ]);
              });

            // load new data
            this.onLoadUsers();
          },
          (error: any) => {
            this.common.showError(`Add failure! ${error.message}`);

            // load new data
            this.onLoadUsers();
          }
        )
    );
  }
}
