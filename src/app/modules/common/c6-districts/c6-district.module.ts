import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C6DistrictComponent } from './c6-district.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { C6DistrictAddComponent } from './c6-district-add/c6-district-add.component';
import { C6DistrictUpdateComponent } from './c6-district-update/c6-district-update.component';
import { C6DistrictFilterComponent } from './c6-district/c6-district-filter.component';
import { C6DistrictSearchComponent } from './c6-district-search/c6-district-search.component';
@NgModule({
  declarations: [
    C6DistrictComponent,
    C6DistrictAddComponent,
    C6DistrictUpdateComponent,
    C6DistrictFilterComponent,
    C6DistrictSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C6DistrictComponent,
        children: [],
      },
      {
        path: 'add',
        component: C6DistrictAddComponent,
      },
      {
        path: 'update/:id',
        component: C6DistrictUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class C6DistrictModule {}
