import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestQuestionComponent } from './test-question.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TestQuestionAddComponent } from './test-question-add/test-question-add.component';
import { TestQuestionUpdateComponent } from './test-question-update/test-question-update.component';
import { TestQuestionFilterComponent } from './test-question-filter/test-question-filter.component';
@NgModule({
  declarations: [
    TestQuestionComponent,
    TestQuestionAddComponent,
    TestQuestionUpdateComponent,
    TestQuestionFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TestQuestionComponent,
        children: [],
      },
      {
        path: 'add',
        component: TestQuestionAddComponent,
      },
      {
        path: 'update/:id',
        component: TestQuestionUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class TestQuestionModule {}
