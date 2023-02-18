import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F10AssetsPackagesSearchComponent } from './f10-assets-packages-search/f10-assets-packages-search.component';
import { F10AssetsPackagesFilterComponent } from './f10-assets-packages-filter/f10-assets-packages-filter.component';
import { F10AssetsPackagesUpdateComponent } from './f10-assets-packages-update/f10-assets-packages-update.component';
import { F10AssetsPackagesAddComponent } from './f10-assets-packages-add/f10-assets-packages-add.component';
import { F10AssetsPackagesComponent } from './f10-assets-packages.component';

@NgModule({
  declarations: [
    F10AssetsPackagesAddComponent,
    F10AssetsPackagesComponent,
    F10AssetsPackagesUpdateComponent,
    F10AssetsPackagesFilterComponent,
    F10AssetsPackagesSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F10AssetsPackagesComponent,
        children: [],
      },
      {
        path: 'add',
        component: F10AssetsPackagesAddComponent,
      },
      {
        path: 'update/:id',
        component: F10AssetsPackagesUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F10AssetsPackagesModule { }
