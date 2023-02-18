import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingService } from 'src/app/core/services/features/f12-setting.service';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  // subscription
  subscription: Subscription[] = [];

  settings: any = [];

  constructor(private settingService: SettingService) {
    this.onLoadSettings();
  }

  /**
   * Load settings
   */
  onLoadSettings() {
    console.log('Loading settings...');
    this.subscription.push(
      this.settingService
        .paginate({ fields: 'logo', filter: '', limit: 1, page: 0 })
        .subscribe((data) => {
          this.settings = data;
        })
    );
  }

  ngOnInit(): void {
    document.body.classList.add('bg-white');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }
}
