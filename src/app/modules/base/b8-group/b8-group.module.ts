import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B8GroupComponent } from './b8-group.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B8GroupAddComponent } from './b8-group-add/b8-group-add.component';
import { B8GroupUpdateComponent } from './b8-group-update/b8-group-update.component';
import { B8GroupFilterComponent } from './b8-group-filter/b8-group-search.component';
import { B8TabUserInGroupComponent } from './b8-tabs/b8-user-in-group/b8-tab-user-in-group.component';
import { B8TabAddUserToGroupComponent } from './b8-tabs/b8-add-user-to-group/b8-tab-add-user-to-group.component';

@NgModule({
  declarations: [
    B8GroupComponent,
    B8GroupAddComponent,
    B8GroupUpdateComponent,
    B8GroupFilterComponent,
    B8TabUserInGroupComponent,
    B8TabAddUserToGroupComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B8GroupComponent,
        children: [],
      },
      {
        path: 'add',
        component: B8GroupAddComponent,
      },
      {
        path: 'update/:id',
        component: B8GroupUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B8GroupModule {}
