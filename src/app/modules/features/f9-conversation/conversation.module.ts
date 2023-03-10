import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversationComponent } from './conversation.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ConversationAddComponent } from './conversation-add/conversation-add.component';
import { ConversationUpdateComponent } from './conversation-update/conversation-update.component';
import { ConversationFilterComponent } from './conversation-filter/conversation-filter.component';
@NgModule({
  declarations: [
    ConversationComponent,
    ConversationAddComponent,
    ConversationUpdateComponent,
    ConversationFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConversationComponent,
        children: [],
      },
      {
        path: 'add',
        component: ConversationAddComponent,
      },
      {
        path: 'update/:id',
        component: ConversationUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class ConversationModule {}
