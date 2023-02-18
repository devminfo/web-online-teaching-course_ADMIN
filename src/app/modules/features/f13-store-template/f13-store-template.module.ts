import { F13StoreTemplateSearchComponent } from './f13-store-template-search/f13-store-template-search.component';
import { F13StoreTemplateUpdateComponent } from './f13-store-template-update/f13-store-template-update.component';
import { F13StoreTemplateAddComponent } from './f13-store-template-add/f13-store-template-add.component';
import { F13StoreTemplateComponent } from './f13-store-template.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
@NgModule({
  declarations: [
    F13StoreTemplateComponent,
    F13StoreTemplateAddComponent,
    F13StoreTemplateUpdateComponent,
    F13StoreTemplateSearchComponent
  ],
  imports: [
    CKEditorModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F13StoreTemplateComponent,
        children: [],
      },
      {
        path: 'add',
        component: F13StoreTemplateAddComponent,
      },
      {
        path: 'update/:id',
        component:F13StoreTemplateUpdateComponent
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
  providers: [DatePipe]
})
export class F13StoreTemplateModule { }
