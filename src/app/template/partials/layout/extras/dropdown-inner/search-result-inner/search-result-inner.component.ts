import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';
  // subscription
  subscription: Subscription[] = [];

  resultModels: any[] = [];
  recentlySearchedModels: any[] = [];

  keyword: string = '';
  searching: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly groupDetailService: GroupDetailService
  ) {}

  ngOnInit(): void {
    this.onLoadDataSources();
  }

  /**
   * Search
   * @param keyword
   */
  search(keyword: string) {
    this.recentlySearchedModels = this.resultModels.filter((groupDetail: any) =>
      groupDetail.link.includes(keyword)
    );
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.keyword = '';
  }

  /**
   * onLoadDataSources
   */
  onLoadDataSources() {
    const filter = '&sort=position&populate=childs';
    this.subscription.push(
      this.groupDetailService
        .getMenuOfCurrentUser(1, 99, filter)
        .subscribe((data) => {
          // clear grid
          const results = this.groupDetailService.handleDataMenus(data);

          // format data source
          for (let i = 0; i < results.length; i++) {
            this.resultModels.push(results[i]);
            this.recentlySearchedModels.push(results[i]);

            // add if exists results
            if (results[i].childs.length > 0) {
              this.resultModels.push(...results[i].childs);
              this.recentlySearchedModels.push(...results[i].childs);
            }
          }
        })
    );
  }
}
