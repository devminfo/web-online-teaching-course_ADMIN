import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C7WardComponent } from './c7-ward.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { C7WardAddComponent } from './c7-ward-add/c7-ward-add.component';
import { C7WardUpdateComponent } from './c7-ward-update/C7WardUpdateComponent';
import { C7WardFilterComponent } from './c7-ward-filter/c7-ward-filter.component';
@NgModule({
  declarations: [
    C7WardComponent,
    C7WardAddComponent,
    C7WardUpdateComponent,
    C7WardFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C7WardComponent,
        children: [],
      },
      {
        path: 'add',
        component: C7WardAddComponent,
      },
      {
        path: 'update/:id',
        component: C7WardUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class C7WardModule {}
