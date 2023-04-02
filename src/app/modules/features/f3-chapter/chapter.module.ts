import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChapterComponent } from './chapter.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ChapterAddComponent } from './chapter-add/chapter-add.component';
import { ChapterUpdateComponent } from './chapter-update/chapter-update.component';
import { ChapterFilterComponent } from './chapter-filter/chapter-filter.component';
import { ChapterCourseComponent } from './chapter-course/chapter-course.component';
@NgModule({
  declarations: [
    ChapterComponent,
    ChapterAddComponent,
    ChapterUpdateComponent,
    ChapterFilterComponent,
    ChapterCourseComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChapterComponent,
      },
      {
        path: 'course/:id',
        component: ChapterCourseComponent,
      },
      {
        path: 'add',
        component: ChapterAddComponent,
      },
      {
        path: 'update/:id',
        component: ChapterUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class ChapterModule {}
