import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F13GroupServicesComponent } from './f13-group-services.component';
import { F13GroupServicesAddComponent } from './f13-group-services-add/f13-group-services-add.component';
import { F13GroupServicesFilterComponent } from './f13-group-services-filter/f13-group-services-filter.component';
import { F13GroupServicesUpdateComponent } from './f13-group-services-update/f13-group-services-update.component';
import { F13GroupServicesSearchComponent } from './f13-group-services-search/f13-group-services-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from 'src/app/template/partials';

@NgModule({
  declarations: [
    F13GroupServicesComponent,
    F13GroupServicesAddComponent,
    F13GroupServicesFilterComponent,
    F13GroupServicesUpdateComponent,
    F13GroupServicesSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F13GroupServicesComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F13GroupServicesAddComponent,
      },
      {
        path: 'update/:id',
        component: F13GroupServicesUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule
  ]
})
export class F13GroupServicesModule { }
