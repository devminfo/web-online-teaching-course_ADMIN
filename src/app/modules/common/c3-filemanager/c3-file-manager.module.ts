import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C3FileManagerComponent } from './c3-file-manager.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [C3FileManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C3FileManagerComponent,
        children: [],
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
    CKEditorModule,
  ],
  entryComponents: [],
})
export class C4FileManagerModule {}
