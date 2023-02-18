import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F14StoreServicesComponent } from './f14-store-services.component';
import { F14StoreServicesAddComponent } from './f14-store-services-add/f14-store-services-add.component';
import { F14StoreServicesUpdateComponent } from './f14-store-services-update/f14-store-services-update.component';
import { F14StoreServicesSearchComponent } from './f14-store-services-search/f14-store-services-search.component';
import { F14StoreServicesFilterComponent } from './f14-store-services-filter/f14-store-services-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';

@NgModule({
  declarations: [
    F14StoreServicesComponent,
    F14StoreServicesAddComponent,
    F14StoreServicesUpdateComponent,
    F14StoreServicesSearchComponent,
    F14StoreServicesFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F14StoreServicesComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F14StoreServicesAddComponent,
      },
      {
        path: 'update/:id',
        component: F14StoreServicesUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule
  ]
})
export class F14StoreServicesModule { }

