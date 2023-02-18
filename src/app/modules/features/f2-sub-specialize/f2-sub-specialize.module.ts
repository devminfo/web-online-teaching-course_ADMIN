import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F2SubSpecializeComponent } from './f2-sub-specialize.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F2SubSpecializeAddComponent } from './f2-sub-specialize-add/f2-sub-specialize-add.component';
import { F2SubSpecializeUpdateComponent } from './f2-sub-specialize-update/f2-sub-specialize-update.component';
import { F2SubSpecializeFilterComponent } from './f2-sub-specialize-filter/f2-sub-specialize-filter.component';
@NgModule({
  declarations: [
    F2SubSpecializeComponent,
    F2SubSpecializeAddComponent,
    F2SubSpecializeUpdateComponent,
    F2SubSpecializeFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F2SubSpecializeComponent,
        children: [],
      },
      {
        path: 'add',
        component: F2SubSpecializeAddComponent,
      },
      {
        path: 'update/:id',
        component: F2SubSpecializeUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F2SubSpecializeModule {}
