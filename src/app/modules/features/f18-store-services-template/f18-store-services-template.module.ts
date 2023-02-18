import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F18StoreServicesTemplateComponent } from './f18-store-services-template.component';
import { F18StoreServicesTemplateAddComponent } from './f18-store-services-template-add/f18-store-services-template-add.component';
import { F18StoreServicesTemplateUpdateComponent } from './f18-store-services-template-update/f18-store-services-template-update.component';
import { F18StoreServicesTemplateSearchComponent } from './f18-store-services-template-search/f18-store-services-template-search.component';
import { F18StoreServicesTemplateFilterComponent } from './f18-store-services-template-filter/f18-store-services-template-filter.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';



@NgModule({
  declarations: [
    F18StoreServicesTemplateComponent,
    F18StoreServicesTemplateAddComponent,
    F18StoreServicesTemplateUpdateComponent,
    F18StoreServicesTemplateSearchComponent,
    F18StoreServicesTemplateFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F18StoreServicesTemplateComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F18StoreServicesTemplateAddComponent,
      },
      {
        path: 'update/:id',
        component: F18StoreServicesTemplateUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule
  ]
})
export class F18StoreServicesTemplateModule { }
