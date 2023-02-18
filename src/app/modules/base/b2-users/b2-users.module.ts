import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B2UsersComponent } from './b2-users.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { B2UsersAddComponent } from './b2-users-add/b2-users-add.component';
import { B2UsersUpdateComponent } from './b2-users-update/b2-users-update.component';
import { B2UsersSearchComponent } from './b2-users-search/b2-users-search.component';
import { B8TabUserInGroupComponent } from './b2-users-tabs/b2-user-in-group/b2-tab-user-in-group.component';
import { B8TabAddUserToGroupComponent } from './b2-users-tabs/b2-add-user-to-group/b2-tab-add-user-to-group.component';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B2TabUsersGroupComponent } from './b2-tab-users-group/b2-tab-users-group.component';
import { B2UsersFilterComponent } from './b2-users-filter/b2-users-filter.component';

@NgModule({
  declarations: [
    B2UsersComponent,
    B2UsersAddComponent,
    B2UsersUpdateComponent,
    B2UsersSearchComponent,
    B8TabUserInGroupComponent,
    B8TabAddUserToGroupComponent,
    B2TabUsersGroupComponent,
    B2UsersFilterComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B2UsersComponent,
        children: [],
      },
      {
        path: 'add',
        component: B2UsersAddComponent,
      },
      {
        path: 'update/:id',
        component: B2UsersUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B2UsersModule {}
