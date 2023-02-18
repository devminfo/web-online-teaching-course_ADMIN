import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F10NotificationAddComponent } from './f10-notification-add/f10-notification-add.component';
import { F10NotificationUpdateComponent } from './f10-notification-update/f10-notification-update.component';
import { F10NotificationFilterComponent } from './f10-notification-filter/f10-notification-filter.component';
import { F10NotificationSearchComponent } from './f10-notification-search/f10-notification-search.component';
import { F10NotificationComponent, } from './f10-notification.component';
import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [
    F10NotificationComponent,
    F10NotificationAddComponent,
    F10NotificationUpdateComponent,
    F10NotificationFilterComponent,
    F10NotificationSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: F10NotificationComponent, children: [
        ],
      },
      {
        path: 'add',
        component: F10NotificationAddComponent,
      },
      {
        path: 'update/:id',
        component: F10NotificationUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
    CKEditorModule
  ],
  entryComponents: []
})
export class F10NotificationModule { }	
