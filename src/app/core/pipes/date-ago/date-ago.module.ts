import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
  declarations: [DateAgoPipe],
  imports: [CommonModule],
  exports: [DateAgoPipe],
})
export class DateAgoModule {}
