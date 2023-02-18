import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F4SubjectComponent, } from './f4-subject.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F4SubjectAddComponent } from './f4-subject-add/f4-subject-add.component';
import { F4SubjectUpdateComponent } from './f4-subject-update/f4-subject-update.component';
import { F4SubjectFilterComponent } from './f4-subject-filter/f4-subject-filter.component';

@NgModule({
  declarations: [
    F4SubjectComponent,
    F4SubjectAddComponent,
    F4SubjectUpdateComponent,
    F4SubjectFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F4SubjectComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F4SubjectAddComponent,
      },
      {
        path: 'update/:id',
        component: F4SubjectUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    // DropdownMenusModule
  ],
  entryComponents: []
})
export class F4SubjectModule { }	
