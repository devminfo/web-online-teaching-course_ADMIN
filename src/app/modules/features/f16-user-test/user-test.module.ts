import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserTestComponent } from './user-test.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserTestAddComponent } from './user-test-add/user-test-add.component';
import { UserTestUpdateComponent } from './user-test-update/user-test-update.component';
import { UserTestFilterComponent } from './user-test-filter/user-test-filter.component';
@NgModule({
  declarations: [
    UserTestComponent,
    UserTestAddComponent,
    UserTestUpdateComponent,
    UserTestFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserTestComponent,
        children: [],
      },
      {
        path: 'add',
        component: UserTestAddComponent,
      },
      {
        path: 'update/:id',
        component: UserTestUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class UserTestModule {}
