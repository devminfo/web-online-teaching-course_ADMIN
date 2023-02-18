import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B7GroupDetailComponent, } from './b7-group-detail.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule, } from 'src/app/template/partials';
import { B7GroupDetailAddComponent } from './b7-group-detail-add/b7-group-detail-add.component';
import { B7GroupDetailUpdateComponent } from './b7-group-detail-update/b7-group-detail-update.component';

@NgModule({
  declarations: [
    B7GroupDetailComponent,
    B7GroupDetailAddComponent,
    B7GroupDetailUpdateComponent 
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: B7GroupDetailComponent, children: [
        ],
      },
      {
        path: 'add',
        component: B7GroupDetailAddComponent,
      },
      {
        path: 'update/:id',
        component: B7GroupDetailUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),

    InlineSVGModule, 
    DropdownMenusModule
  ],
  entryComponents: []
})
export class B7GroupDetailModule { }	
