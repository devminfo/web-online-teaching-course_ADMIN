import { Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/common/i18n';
// language list
import { locale as enLang } from './modules/common/i18n/vocabs/en';
import { locale as chLang } from './modules/common/i18n/vocabs/ch';
import { locale as esLang } from './modules/common/i18n/vocabs/es';
import { locale as jpLang } from './modules/common/i18n/vocabs/jp';
import { locale as deLang } from './modules/common/i18n/vocabs/de';
import { locale as frLang } from './modules/common/i18n/vocabs/fr';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() { }
}
