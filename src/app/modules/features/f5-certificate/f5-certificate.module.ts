import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F5CertificateComponent } from './f5-certificate.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { F5CertificateAddComponent } from './f5-certificate-add/f5-certificate-add.component';
import { F5CertificateUpdateComponent } from './f5-certificate-update/f5-certificate-update.component';
import { F5CertificateFilterComponent } from './f5-certificate-filter/f5-certificate-filter.component';
@NgModule({
  declarations: [
    F5CertificateComponent,
    F5CertificateAddComponent,
    F5CertificateUpdateComponent,
    F5CertificateFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F5CertificateComponent,
        children: [],
      },
      {
        path: 'add',
        component: F5CertificateAddComponent,
      },
      {
        path: 'update/:id',
        component: F5CertificateUpdateComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
  ],
  entryComponents: [],
})
export class F5CertificateModule {}
