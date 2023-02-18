import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F11StorePackageTransactionsComponent } from './f11-store-package-transactions.component';
import { F11StorePackageTransactionsDetailComponent } from './f11-store-package-transactions-detail/f11-store-package-transactions-detail.component';
import { F11StorePackageTransactionsFilterComponent } from './f11-store-package-transactions-filter/f11-store-package-transactions-filter.component';
import { F11StorePackageTransactionsSearchComponent } from './f11-store-package-transactions-search/f11-store-package-transactions-search.component';

@NgModule({
  declarations: [
    F11StorePackageTransactionsComponent,
    F11StorePackageTransactionsDetailComponent,
    F11StorePackageTransactionsFilterComponent,
    F11StorePackageTransactionsSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F11StorePackageTransactionsComponent,
        children: [],
      },
      {
        path: 'detail/:id',
        component:F11StorePackageTransactionsDetailComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F11StorePackageTransactionsModule { }
