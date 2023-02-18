import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'profile-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  // subscription
  subscription: Subscription[] = [];

  groupsName: string;
  profile: any;

  /**
   * constructor
   * @param userService
   */
  constructor(private userService: UserService) {
    // load data user
    this.onLoadData();
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

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
