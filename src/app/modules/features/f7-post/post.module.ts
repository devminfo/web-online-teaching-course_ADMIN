import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PostAddComponent } from './post-add/post-add.component';
import { PostUpdateComponent } from './post-update/post-update.component';
import { PostFilterComponent } from './post-filter/post-filter.component';
@NgModule({
  declarations: [
    PostComponent,
    PostAddComponent,
    PostUpdateComponent,
    PostFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PostComponent,
        children: [],
      },
      {
        path: 'add',
        component: PostAddComponent,
      },
      {
        path: 'update/:id',
        component: PostUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class PostModule {}
