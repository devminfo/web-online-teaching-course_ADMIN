import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayQuizComponent } from './play-quiz.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PlayQuizAddComponent } from './play-quiz-add/play-quiz-add.component';
import { PlayQuizUpdateComponent } from './play-quiz-update/play-quiz-update.component';
import { PlayQuizFilterComponent } from './play-quiz-filter/play-quiz-filter.component';
@NgModule({
  declarations: [
    PlayQuizComponent,
    PlayQuizAddComponent,
    PlayQuizUpdateComponent,
    PlayQuizFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlayQuizComponent,
        children: [],
      },
      {
        path: 'add',
        component: PlayQuizAddComponent,
      },
      {
        path: 'update/:id',
        component: PlayQuizUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class PlayQuizModule {}
