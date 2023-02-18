import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B4AuthUserAccessComponent } from './b4-auth-user-access.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B4AuthUserAccessAddComponent } from './b4-auth-user-access-add/b4-auth-user-access-add.component';
import { B4AuthUserAccessUpdateComponent } from './b4-auth-user-access-update/b4-auth-user-access-update.component';
import { B4AuthUserAccessFilterComponent } from './b4-auth-user-access-search/b4-auth-user-access-search.component';

@NgModule({
  declarations: [
    B4AuthUserAccessComponent,
    B4AuthUserAccessAddComponent,
    B4AuthUserAccessUpdateComponent,
    B4AuthUserAccessFilterComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B4AuthUserAccessComponent,
        children: [],
      },
      {
        path: 'add',
        component: B4AuthUserAccessAddComponent,
      },
      {
        path: 'update/:id',
        component: B4AuthUserAccessUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B4AuthUserAccessModule {}
