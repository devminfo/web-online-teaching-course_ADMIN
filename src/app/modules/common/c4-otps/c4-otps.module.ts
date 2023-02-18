import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C4OtpComponent } from './c4-otp.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [C4OtpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C4OtpComponent,
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
export class C4OtpModule {}
