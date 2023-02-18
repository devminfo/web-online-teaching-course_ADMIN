import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B5AuthUserIdComponent } from './b5-auth-user-id.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B5AuthUserIdAddComponent } from './b5-auth-user-id-add/b5-auth-user-id-add.component';
import { B5AuthUserIdUpdateComponent } from './b5-auth-user-id-update/b5-auth-user-id-update.component';
import { B5AuthUserIdFilterComponent } from './b5-auth-user-id-search/b5-auth-user-id-search.component';

@NgModule({
  declarations: [
    B5AuthUserIdComponent,
    B5AuthUserIdAddComponent,
    B5AuthUserIdUpdateComponent,
    B5AuthUserIdFilterComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B5AuthUserIdComponent,
        children: [],
      },
      {
        path: 'add',
        component: B5AuthUserIdAddComponent,
      },
      {
        path: 'update/:id',
        component: B5AuthUserIdUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B5AuthUserIdModule {}
