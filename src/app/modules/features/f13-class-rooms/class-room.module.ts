import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassRoomComponent } from './class-room.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClassRoomAddComponent } from './class-room-add/class-room-add.component';
import { ClassRoomUpdateComponent } from './class-room-update/class-room-update.component';
import { ClassRoomFilterComponent } from './class-room-filter/class-room-filter.component';
@NgModule({
  declarations: [
    ClassRoomComponent,
    ClassRoomAddComponent,
    ClassRoomUpdateComponent,
    ClassRoomFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClassRoomComponent,
        children: [],
      },
      {
        path: 'add',
        component: ClassRoomAddComponent,
      },
      {
        path: 'update/:id',
        component: ClassRoomUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class ClassRoomModule {}
