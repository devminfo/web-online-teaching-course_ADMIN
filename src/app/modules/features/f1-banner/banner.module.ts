import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from './banner.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BannerAddComponent } from './banner-add/banner-add.component';
import { BannerUpdateComponent } from './banner-update/banner-update.component';
import { BannerFilterComponent } from './banner-filter/banner-filter.component';
@NgModule({
  declarations: [
    BannerComponent,
    BannerAddComponent,
    BannerUpdateComponent,
    BannerFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BannerComponent,
        children: [],
      },
      {
        path: 'add',
        component: BannerAddComponent,
      },
      {
        path: 'update/:id',
        component: BannerUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class BannerModule {}
