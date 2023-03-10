import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionComponent } from './question.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { QuestionAddComponent } from './question-add/question-add.component';
import { QuestionUpdateComponent } from './question-update/question-update.component';
import { QuestionFilterComponent } from './question-filter/question-filter.component';
@NgModule({
  declarations: [
    QuestionComponent,
    QuestionAddComponent,
    QuestionUpdateComponent,
    QuestionFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuestionComponent,
        children: [],
      },
      {
        path: 'add',
        component: QuestionAddComponent,
      },
      {
        path: 'update/:id',
        component: QuestionUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class QuestionModule {}
