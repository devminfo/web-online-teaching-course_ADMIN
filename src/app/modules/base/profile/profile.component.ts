import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  // subscription
  subscription: Subscription[] = [];
  profileCompletionPercentage = 0;
  profileCompletionPercentageProgressWith = '0%';

  groupsNames: string[];
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
          // add default image if avatar empty
          if (data.avatar == '') {
            data.avatar = 'assets/noimage.jpeg';
          }

          this.profile = data;
          this.groupsNames = data?.groups
            ? data.groups.map((group: any) => group.name)
            : [];

          if (data.avatar) {
            this.profileCompletionPercentage += 10;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.fullName) {
            this.profileCompletionPercentage += 20;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.phone) {
            this.profileCompletionPercentage += 20;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.email) {
            this.profileCompletionPercentage += 20;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.address) {
            this.profileCompletionPercentage += 10;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.gender) {
            this.profileCompletionPercentage += 10;
            this.profileCompletionPercentageProgressWith = `${this.profileCompletionPercentage}%`;
          }
          if (data.born) {
            this.profileCompletionPercentage += 10;
            this.profileCompletionPercentageProgressWith += 10;
          }
        })
    );
  }
}
