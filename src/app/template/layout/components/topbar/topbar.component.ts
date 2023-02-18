import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  // subscription
  subscription: Subscription[] = [];

  user: any;
  /**
   * constructor
   * @param userService
   * @param commonService
   */
  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private layout: LayoutService
  ) {
    // load data user
    this.onLoadData();
  }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
  }
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
        .getMe({ populate: '', fields: 'fullName,avatar' })
        .subscribe((data) => {
          // add default image if avatar empty
          if (data.avatar == '') {
            data.avatar = 'assets/noimage.jpeg';
          }

          this.user = data;
        })
    );
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }
}
