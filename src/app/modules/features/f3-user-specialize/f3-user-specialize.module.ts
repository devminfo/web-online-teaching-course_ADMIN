import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F3UserSpecializeComponent } from './f3-user-specialize.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F3UserSpecializeAddComponent } from './f3-user-specialize-add/f3-user-specialize-add.component';
import { F3UserSpecializeUpdateComponent } from './f3-user-specialize-update/f3-user-specialize-update.component';
import { F3UserSpecializeFilterComponent } from './f3-user-specialize-filter/f3-user-specialize-filter.component';
@NgModule({
  declarations: [
    F3UserSpecializeComponent,
    F3UserSpecializeAddComponent,
    F3UserSpecializeUpdateComponent,
    F3UserSpecializeFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F3UserSpecializeComponent,
        children: [],
      },
      {
        path: 'add',
        component: F3UserSpecializeAddComponent,
      },
      {
        path: 'update/:id',
        component: F3UserSpecializeUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F3UserSpecializeModule {}
