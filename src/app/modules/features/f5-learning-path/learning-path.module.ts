import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LearningPathComponent } from './learning-path.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LearningPathAddComponent } from './learning-path-add/learning-path-add.component';
import { LearningPathUpdateComponent } from './learning-path-update/learning-path-update.component';
import { LearningPathFilterComponent } from './learning-path-filter/learning-path-filter.component';
import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [
    LearningPathComponent,
    LearningPathAddComponent,
    LearningPathUpdateComponent,
    LearningPathFilterComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    RouterModule.forChild([
      {
        path: '',
        component: LearningPathComponent,
        children: [],
      },
      {
        path: 'add',
        component: LearningPathAddComponent,
      },
      {
        path: 'update/:id',
        component: LearningPathUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
  ],
  entryComponents: [],
})
export class LearningPathModule {}
