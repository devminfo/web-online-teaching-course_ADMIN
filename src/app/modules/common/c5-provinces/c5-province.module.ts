import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C5ProvinceComponent } from './c5-province.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { C5ProvinceAddComponent } from './c5-province-add/c5-province-add.component';
import { C5ProvinceUpdateComponent } from './c5-province-update/c5-province-update.component';
import { C5ProvinceFilterComponent } from './c5-province-filter/c5-province-filter.component';
@NgModule({
  declarations: [
    C5ProvinceComponent,
    C5ProvinceAddComponent,
    C5ProvinceUpdateComponent,
    C5ProvinceFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C5ProvinceComponent,
        children: [],
      },
      {
        path: 'add',
        component: C5ProvinceAddComponent,
      },
      {
        path: 'update/:id',
        component: C5ProvinceUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class C5ProvinceModule {}
