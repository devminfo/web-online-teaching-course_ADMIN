import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  // subscription
  subscription: Subscription[] = [];

  // condition fillter
  conditonFilter: string = '';
  conditions: any[] = [];

  // data source for grid
  dataSources: any[] = [];

  // delete id
  deleteId: String;

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    private commonService: CommonService,
    private api: GroupDetailService,
    private router: Router
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
   * on Load Data Grid
   */
  onLoadDataGrid() {
    const filter = '&sort=position&populate=childs';
    this.subscription.push(
      this.api.getMenuOfCurrentUser(1, 99, filter).subscribe((data) => {
        // clear grid
        this.dataSources = this.api
          .handleDataMenus(data)
          .filter((result: any) => result.isHorizontalMenu);
      })
    );
  }

  /**
   * calculateMenuItemCssClass
   * @param url
   * @returns
   */
  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }
}

/**
 * getCurrentUrl
 * @param pathname
 * @returns
 */
const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

/**
 * checkIsActive
 * @param pathname
 * @param url
 * @returns
 */
const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
