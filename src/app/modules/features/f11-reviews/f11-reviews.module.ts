import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F11ReviewsComponent } from './f11-reviews.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F11ReviewsAddComponent } from './f11-reviews-add/f11-reviews-add.component';
import { F11ReviewsFilterComponent } from './f11-reviews-filter/f11-reviews-filter.component';
import { F11ReviewsUpdateComponent } from './f11-reviews-update/f11-reviews-update.component';
import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [
    F11ReviewsComponent,
    F11ReviewsAddComponent,
    F11ReviewsUpdateComponent,
    F11ReviewsFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F11ReviewsComponent,
        children: [],
      },
      {
        path: 'add',
        component: F11ReviewsAddComponent,
      },
      {
        path: 'update/:id',
        component: F11ReviewsUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    CKEditorModule
  ],
  entryComponents: [],
})
export class F11ReviewsModule {}
