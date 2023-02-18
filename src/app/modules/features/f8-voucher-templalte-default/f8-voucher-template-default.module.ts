import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F8VoucherTemplateDefaultSearchComponent } from './f8-voucher-template-default-search/f8-voucher-template-default-search.component';
import { F8VoucherTemplateDefaultFilterComponent } from './f8-voucher-template-default-filter/f8-voucher-template-default-filter.component';
import { F8VoucherTemplateDefaultUpdateComponent } from './f8-voucher-template-default-update/f8-voucher-template-default-update.component';
import { F8VoucherTemplateDefaultAddComponent } from './f8-voucher-template-default-add/f8-voucher-template-default-add.component';
import { F8VoucherTemplateDefaultComponent } from './f8-voucher-template-default.component';
@NgModule({
  declarations: [
    F8VoucherTemplateDefaultComponent,
    F8VoucherTemplateDefaultAddComponent,
    F8VoucherTemplateDefaultUpdateComponent,
    F8VoucherTemplateDefaultFilterComponent,
    F8VoucherTemplateDefaultSearchComponent,
  ],
  imports: [
    CKEditorModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F8VoucherTemplateDefaultComponent,
        children: [],
      },
      {
        path: 'add',
        component: F8VoucherTemplateDefaultAddComponent,
      },
      {
        path: 'update/:id',
        component: F8VoucherTemplateDefaultUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
  providers: [DatePipe]
})
export class F8VoucherTemplateDefaultModule { }
