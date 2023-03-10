import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LectureComponent } from './lecture.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LectureAddComponent } from './lecture-add/lecture-add.component';
import { LectureUpdateComponent } from './lecture-update/lecture-update.component';
import { LectureFilterComponent } from './lecture-filter/lecture-filter.component';
@NgModule({
  declarations: [
    LectureComponent,
    LectureAddComponent,
    LectureUpdateComponent,
    LectureFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LectureComponent,
        children: [],
      },
      {
        path: 'add',
        component: LectureAddComponent,
      },
      {
        path: 'update/:id',
        component: LectureUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class LectureModule {}
