import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionComponent } from './transaction.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { TransactionUpdateComponent } from './transaction-update/transaction-update.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
@NgModule({
  declarations: [
    TransactionComponent,
    TransactionAddComponent,
    TransactionUpdateComponent,
    TransactionFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TransactionComponent,
        children: [],
      },
      {
        path: 'add',
        component: TransactionAddComponent,
      },
      {
        path: 'update/:id',
        component: TransactionUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class TransactionModule {}
