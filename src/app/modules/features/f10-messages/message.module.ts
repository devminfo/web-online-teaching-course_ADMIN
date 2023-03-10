import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MessageAddComponent } from './message-add/message-add.component';
import { MessageUpdateComponent } from './message-update/message-update.component';
import { MessageFilterComponent } from './message-filter/message-filter.component';
@NgModule({
  declarations: [
    MessageComponent,
    MessageAddComponent,
    MessageUpdateComponent,
    MessageFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessageComponent,
        children: [],
      },
      {
        path: 'add',
        component: MessageAddComponent,
      },
      {
        path: 'update/:id',
        component: MessageUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class MessageModule {}
