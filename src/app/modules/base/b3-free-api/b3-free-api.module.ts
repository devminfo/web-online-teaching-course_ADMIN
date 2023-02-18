import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B3FreeAPIComponent } from './b3-free-api.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B3FreeAPIAddComponent } from './b3-free-api-add/b3-free-api-add.component';
import { B3FreeAPIUpdateComponent } from './b3-free-api-update/b3-free-api-update.component';
import { F2SubSpecializeFilterComponent } from './f3-free-api-search/f3-free-api-search.component';

@NgModule({
  declarations: [
    B3FreeAPIComponent,
    B3FreeAPIAddComponent,
    B3FreeAPIUpdateComponent,
    F2SubSpecializeFilterComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B3FreeAPIComponent,
        children: [],
      },
      {
        path: 'add',
        component: B3FreeAPIAddComponent,
      },
      {
        path: 'update/:id',
        component: B3FreeAPIUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B3FreeAPIModule {}
