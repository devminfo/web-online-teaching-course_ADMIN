import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C2HistoryComponent } from './c2-history.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';
import { C2HistoryFilterComponent } from './c2-history-filter/c2-history-filter.component';

@NgModule({
  declarations: [C2HistoryComponent, C2HistoryFilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C2HistoryComponent,
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
export class C2HistoryModule {}
