import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F7HistoryQuizComponent } from './f7-historyquiz.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F7HistoryQuizAddComponent } from './f7-historyquiz-add/f7-historyquiz-add.component';
import { F7HistoryQuizUpdateComponent } from './f7-historyquiz-update/f7-historyquiz-update.component';
import { F7HistoryQuizFilterComponent } from './f7-historyquiz-filter/f7-historyquiz-filter.component';

@NgModule({
  declarations: [
    F7HistoryQuizComponent,
    F7HistoryQuizAddComponent,
    F7HistoryQuizUpdateComponent,
    F7HistoryQuizFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F7HistoryQuizComponent,
        children: [],
      },
      {
        path: 'add',
        component: F7HistoryQuizAddComponent,
      },
      {
        path: 'update/:id',
        component: F7HistoryQuizUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F7HistoryQuizModule {}
