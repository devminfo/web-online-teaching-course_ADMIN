import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F16StoreComponent } from './f16-store.component';
import { F16StoreAddComponent } from './f16-store-add/f16-store-add.component';
import { F16StoreUpdateComponent } from './f16-store-update/f16-store-update.component';
import { F16StoreSearchComponent } from './f16-store-search/f16-store-search.component';
import { F16StoreFilterComponent } from './f16-store-filter/f16-store-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';
import { ChooseStoreModuleComponent } from './choose-store-module/choose-store-module.component';
import { ChooseStoreSearchComponent } from './choose-store-search/choose-store-search.component';

@NgModule({
  declarations: [
    F16StoreComponent,
    F16StoreAddComponent,
    F16StoreUpdateComponent,
    F16StoreSearchComponent,
    F16StoreFilterComponent,
    ChooseStoreModuleComponent,
    ChooseStoreSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F16StoreComponent,
        children: [],
      },
      {
        path: 'add',
        component: F16StoreAddComponent,
      },
      {
        path: 'update/:id',
        component: F16StoreUpdateComponent,
      },
      {
        path: 'choose/:id',
        component: ChooseStoreModuleComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
})
export class F16StoreModule {}
