import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1SpecializeComponent, } from './f1-specialize.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule, } from 'src/app/template/partials';
import { F1SpecializeAddComponent } from './f1-specialize-add/f1-specialize-add.component';
import { F1SpecializeUpdateComponent } from './f1-specialize-update/f1-specialize-update.component';

@NgModule({
  declarations: [
    F1SpecializeComponent,
    F1SpecializeAddComponent,
    F1SpecializeUpdateComponent 
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F1SpecializeComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F1SpecializeAddComponent,
      },
      {
        path: 'update/:id',
        component: F1SpecializeUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),

    InlineSVGModule,
    DropdownMenusModule
  ],
  entryComponents: []
})
export class F1SpecializeModule { }	
