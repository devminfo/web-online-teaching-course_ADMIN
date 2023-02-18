import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent {
  // subscription
  subscription: Subscription[] = [];

  groupsName: string;
  profile: any;

  /**
   * constructor
   * @param userService
   * @param commonService
   */
  constructor(
    private commonService: CommonService,
    private userService: UserService
  ) {
    // load data user
    this.onLoadData();
  }

  /**
   * ngOnInit
   */
  ngOnInit() { }

  /**
   * Load data
   */
  onLoadData() {
    this.getProfile();
  }

  /**
   * Get profile
   */
  getProfile() {
    this.subscription.push(
      this.userService
        .getMe({ populate: 'groups', fields: 'groups.name' })
        .subscribe((data) => {
          this.profile = data;
          this.groupsName = data?.groups
            ? data.groups.map((group: any) => group.name).join(',')
            : '';
        })
    );
  }
}
