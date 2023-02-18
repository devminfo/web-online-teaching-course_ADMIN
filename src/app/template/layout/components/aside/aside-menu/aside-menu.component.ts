import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

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
    private api: GroupDetailService
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
   * remoIsCheckStoreService
   */
  remoIsCheckStoreService(url : string){
    if(url ="/features/storeservices")
    localStorage.removeItem('isCheckStoreService')
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    const filter = '&sort=position&populate=childs';
    this.subscription.push(
      this.api.getMenuOfCurrentUser(1, 99, filter).subscribe((data) => {
        this.dataSources = this.api.handleDataMenus(data);        
      })
    );
  }
}
