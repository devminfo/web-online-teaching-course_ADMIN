import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B6GroupAPIComponent, } from './b6-group-api.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule, } from 'src/app/template/partials';
import { B6GroupAPIAddComponent } from './b6-group-api-add/b6-group-api-add.component';
import { B6GroupAPIUpdateComponent } from './b6-group-api-update/b6-group-api-update.component';

@NgModule({
  declarations: [
    B6GroupAPIComponent,
    B6GroupAPIAddComponent,
    B6GroupAPIUpdateComponent 
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: B6GroupAPIComponent, children: [
        ],
      },
      {
        path: 'add',
        component: B6GroupAPIAddComponent,
      },
      {
        path: 'update/:id',
        component: B6GroupAPIUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),

    InlineSVGModule,
    DropdownMenusModule
  ],
  entryComponents: []
})
export class B6GroupAPIModule { }	
