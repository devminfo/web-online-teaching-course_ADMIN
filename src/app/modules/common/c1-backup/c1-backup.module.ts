import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C1BackupComponent } from './c1-backup.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [C1BackupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C1BackupComponent,
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
export class C1BackupModule {}
