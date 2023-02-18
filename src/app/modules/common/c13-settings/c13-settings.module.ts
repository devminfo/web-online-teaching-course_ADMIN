import { CKEditorModule } from 'ckeditor4-angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { C13SettingUpdateComponent } from './c13-setting-update/c13-setting-update.component';
import { C13SettingsComponent } from './c13-settings.component';

@NgModule({
  declarations: [
    C13SettingsComponent,
    C13SettingUpdateComponent
  ],
  imports: [
    CKEditorModule,
     CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C13SettingsComponent,
        children: [],
      },
      {
        path: 'update/:id',
        component: C13SettingUpdateComponent,
      }
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
  ],
  entryComponents: [],
  providers: [DatePipe]
  })
export class C13SettingsModule { }
