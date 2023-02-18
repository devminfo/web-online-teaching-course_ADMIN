import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F5ServiceOrdersDetailComponent } from './f5-service-orders-detail/f5-service-orders-detail.component';
import { F5ServiceOrdersCheckoutComponent } from './f5-service-orders-checkout/f5-service-orders-checkout.component';
import { F5ServiceOrdersComponent } from './f5-service-orders.component';
import { F5ServiceOrdersSearchComponent } from './f5-service-orders-search/f5-service-orders-search.component';
import { F5ServiceOrdersFilterComponent } from './f5-service-orders-filter/f5-service-orders-filter.component';

@NgModule({declarations: [

    F5ServiceOrdersComponent,
    F5ServiceOrdersDetailComponent,
    F5ServiceOrdersCheckoutComponent,
    F5ServiceOrdersSearchComponent,
    F5ServiceOrdersFilterComponent
],
imports: [
  CommonModule,
  RouterModule.forChild([
    {
      path: '',
      component: F5ServiceOrdersComponent,
      children: [],
    },
    {
      path: 'checkout/:id',
      component: F5ServiceOrdersCheckoutComponent,
    },
    {
      path: 'detail/:id',
      component: F5ServiceOrdersDetailComponent,
    },
  ]),
  FormsModule,
  ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

  InlineSVGModule,
],  
entryComponents: [],
providers: [DatePipe]
})
export class F5ServiceOrdersModule { }
