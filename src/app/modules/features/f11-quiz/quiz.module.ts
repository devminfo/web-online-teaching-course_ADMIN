import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizComponent } from './quiz.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { QuizAddComponent } from './quiz-add/quiz-add.component';
import { QuizUpdateComponent } from './quiz-update/quiz-update.component';
import { QuizFilterComponent } from './quiz-filter/quiz-filter.component';
@NgModule({
  declarations: [
    QuizComponent,
    QuizAddComponent,
    QuizUpdateComponent,
    QuizFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuizComponent,
        children: [],
      },
      {
        path: 'add',
        component: QuizAddComponent,
      },
      {
        path: 'update/:id',
        component: QuizUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class QuizModule {}
