import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F6QuizComponent } from './f6-quiz.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F6QuizAddComponent } from './f6-quiz-add/f6-quiz-add.component';
import { F6QuizUpdateComponent } from './f6-quiz-update/f6-quiz-update.component';
import { F6QuizFilterComponent } from './f6-quiz-filter/f6-quiz-filter.component';

@NgModule({
  declarations: [
    F6QuizComponent,
    F6QuizAddComponent,
    F6QuizUpdateComponent,
    F6QuizFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F6QuizComponent,
        children: [],
      },
      {
        path: 'add',
        component: F6QuizAddComponent,
      },
      {
        path: 'update/:id',
        component: F6QuizUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F6QuizModule {}
