import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { environment } from '../../../../../environments/environment';
import {
  MenuComponent,
  DrawerComponent,
  ToggleComponent,
  ScrollComponent,
} from '../../../kt/components';
import { SettingService } from 'src/app/core/services/features/f12-setting.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  asideTheme: string = '';
  asideMinimize: boolean = false;
  asideMenuCSSClasses: string = '';
  appPreviewDocsUrl: string = environment.appPreviewDocsUrl;
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];
  setting: any = {};

  constructor(
    private layout: LayoutService,
    private router: Router,
    private settingService: SettingService
  ) {
    this.onLoadSettings();
  }

  ngOnInit(): void {
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  /**
   * Load settings
   */
  onLoadSettings() {
    console.log('Loading settings...');
    this.unsubscribe.push(
      this.settingService
        .paginate({ fields: 'logo', filter: '', limit: 1, page: 0 })
        .subscribe((data) => {
          this.setting = data.results[0];
        })
    );
  }
}
