import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F9TransactionComponent } from './f9-transaction.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F9TransactionAddComponent } from './f9-transaction-add/f9-transaction-add.component';
import { F9TransactionUpdateComponent } from './f9-transaction-update/f9-transaction-update.component';
import { F9TransactionFilterComponent } from './f9-transaction-filter/f9-transaction-filter.component';

@NgModule({
  declarations: [
    F9TransactionComponent,
    F9TransactionAddComponent,
    F9TransactionUpdateComponent,
    F9TransactionFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F9TransactionComponent,
        children: [],
      },
      {
        path: 'add',
        component: F9TransactionAddComponent,
      },
      {
        path: 'update/:id',
        component: F9TransactionUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F9TransactionModule {}
