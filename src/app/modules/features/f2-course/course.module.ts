import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseComponent } from './course.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseUpdateComponent } from './course-update/course-update.component';
import { CourseFilterComponent } from './course-filter/course-filter.component';
@NgModule({
  declarations: [
    CourseComponent,
    CourseAddComponent,
    CourseUpdateComponent,
    CourseFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CourseComponent,
        children: [],
      },
      {
        path: 'add',
        component: CourseAddComponent,
      },
      {
        path: 'update/:id',
        component: CourseUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class CourseModule {}
