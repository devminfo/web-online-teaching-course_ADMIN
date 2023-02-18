import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CoreModule } from './core/core.module';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './core/services/common.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { C16BankAccounntsComponent } from './modules/common/c16-bank-accounnts/c16-bank-accounnts.component';
import { C16BankAccounntsAddComponent } from './modules/common/c16-bank-accounnts/c16-bank-accounnts-add/c16-bank-accounnts-add.component';
import { C16BankAccounntsUpdateComponent } from './modules/common/c16-bank-accounnts/c16-bank-accounnts-update/c16-bank-accounnts-update.component';
import { C16BankAccounntsFilterComponent } from './modules/common/c16-bank-accounnts/c16-bank-accounnts-filter/c16-bank-accounnts-filter.component';
import { C16BankAccounntsSearchComponent } from './modules/common/c16-bank-accounnts/c16-bank-accounnts-search/c16-bank-accounnts-search.component';
@NgModule({
  declarations: [
    AppComponent,
    C16BankAccounntsComponent,
    C16BankAccounntsAddComponent,
    C16BankAccounntsUpdateComponent,
    C16BankAccounntsFilterComponent,
    C16BankAccounntsSearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    CoreModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    InlineSVGModule.forRoot(),
    NgbModule,

    // https://www.npmjs.com/package/@ngx-loading-bar/router/v/6.0.0
    LoadingBarRouterModule,


    ToastrModule.forRoot(), // ToastrModule added 
    // https://www.npmjs.com/package/ngx-spinner#stackblitz-demo
    NgxSpinnerModule,
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
