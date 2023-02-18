import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F12SettingComponent, } from './f12-setting.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F12SettingAddComponent } from './f12-setting-add/f12-setting-add.component';
import { F12SettingUpdateComponent } from './f12-setting-update/f12-setting-update.component';
import { F12SettingFilterComponent } from './f12-setting-filter/f12-setting-filter.component';
import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [
    F12SettingComponent,
    F12SettingAddComponent,
    F12SettingUpdateComponent,
    F12SettingFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F12SettingComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F12SettingAddComponent,
      },
      {
        path: 'update/:id',
        component: F12SettingUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
    CKEditorModule
  ],
  entryComponents: []
})
export class F12SettingModule { }	
