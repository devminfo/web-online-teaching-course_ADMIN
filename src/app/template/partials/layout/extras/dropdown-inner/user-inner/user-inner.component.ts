import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { TranslationService } from 'src/app/modules/common/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  subscription: Subscription[] = [];

  user: any;

  language: LanguageFlag;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private translationService: TranslationService
  ) {
    this.onLoadData();
  }

  /**
   * Init
   */
  ngOnInit(): void {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  /**
   * Log out
   */
  logout() {
    this.auth.logout();
    document.location.reload();
  }

  /**
   *
   * Select language
   * @param lang
   */
  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  /**
   * Set language
   * @param lang
   */
  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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
        .getMe({ populate: '', fields: 'fullName,avatar,groups' })
        .subscribe((data) => {
          // add default image if avatar empty
          if (data.avatar == '') {
            data.avatar = 'assets/noimage.jpeg';
          }

          this.user = data;
        })
    );
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
