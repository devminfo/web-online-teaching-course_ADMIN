import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './comment.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommentAddComponent } from './comment-add/comment-add.component';
import { CommentUpdateComponent } from './comment-update/comment-update.component';
import { CommentFilterComponent } from './comment-filter/comment-filter.component';
@NgModule({
  declarations: [
    CommentComponent,
    CommentAddComponent,
    CommentUpdateComponent,
    CommentFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CommentComponent,
        children: [],
      },
      {
        path: 'add',
        component: CommentAddComponent,
      },
      {
        path: 'update/:id',
        component: CommentUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class CommentModule {}
