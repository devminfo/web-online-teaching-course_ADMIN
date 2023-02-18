import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F15StoreModuleComponent } from './f15-store-module.component';
import { F15StoreModuleAddComponent } from './f15-store-module-add/f15-store-module-add.component';
import { F15StoreModuleUpdateComponent } from './f15-store-module-update/f15-store-module-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { F15StoreModuleSearchComponent } from './f15-store-module-search/f15-store-module-search.component';

@NgModule({
  declarations: [
    F15StoreModuleComponent,
    F15StoreModuleAddComponent,
    F15StoreModuleUpdateComponent,
    F15StoreModuleSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F15StoreModuleComponent,
        children: [],
      },
      {
        path: 'add',
        component: F15StoreModuleAddComponent,
      },
      {
        path: 'update/:id',
        component: F15StoreModuleUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
})
export class F15StoreModuleModule {}
