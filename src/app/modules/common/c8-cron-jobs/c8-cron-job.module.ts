import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C8CronJobComponent } from './c8-cron-job.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { C8CronJobFilterComponent } from './c8-cron-job/c8-cron-job-filter.component';
@NgModule({
  declarations: [
    C8CronJobComponent,
    C8CronJobFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: C8CronJobComponent,
        children: [],
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class C8CronJobModule { }
