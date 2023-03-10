import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
@NgModule({
  declarations: [
    CategoryComponent,
    CategoryAddComponent,
    CategoryUpdateComponent,
    CategoryFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryComponent,
        children: [],
      },
      {
        path: 'add',
        component: CategoryAddComponent,
      },
      {
        path: 'update/:id',
        component: CategoryUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class CategoryModule {}
