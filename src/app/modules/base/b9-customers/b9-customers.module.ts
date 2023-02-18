import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { B9CustomersComponent } from './b9-customers.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { B9CustomersAddComponent } from './b9-customers-add/b9-customers-add.component';
import { B9CustomersUpdateComponent } from './b9-customers-update/b9-customers-update.component';
import { B9CustomersSearchComponent } from './b9-customers-search/b9-customers-search.component';
import { B8TabUserInGroupComponent } from './b9-customers-tabs/b9-customer-in-group/b9-tab-customer-in-group.component';
import { B8TabAddUserToGroupComponent } from './b9-customers-tabs/b9-add-customer-to-group/b9-tab-add-customer-to-group.component';
import { DropdownMenusModule } from 'src/app/template/partials';
import { B9TabCustomersGroupComponent } from './b9-tab-customers-group/b9-tab-customers-group.component';
import { B9CustomersFilterComponent } from './b9-customers-filter/b9-customers-filter.component';
import { ChooseStoreModuleComponent } from './choose-store-module/choose-store-module.component';
import { ChooseStaffServiceComponent } from './choose-staff-service/choose-staff-service.component';
import { ChooseStaffServiceFilterComponent } from './choose-staff-service/choose-staff-service-filter/choose-staff-service-filter.component';
import { ChooseStaffServiceSearchComponent } from './choose-staff-service/choose-staff-service-search/choose-staff-service-search.component';

@NgModule({
  declarations: [
    B9CustomersComponent,
    B9CustomersAddComponent,
    B9CustomersUpdateComponent,
    B9CustomersSearchComponent,
    B8TabUserInGroupComponent,
    B8TabAddUserToGroupComponent,
    B9TabCustomersGroupComponent,
    B9CustomersFilterComponent,
    ChooseStoreModuleComponent,
    ChooseStaffServiceComponent,
    ChooseStaffServiceFilterComponent,
    ChooseStaffServiceSearchComponent,
  ],

  imports: [
    // TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B9CustomersComponent,
        children: [],
      },
      {
        path: 'add',
        component: B9CustomersAddComponent,
      },
      {
        path: 'update/:id',
        component: B9CustomersUpdateComponent,
      },
      {
        path: 'choose/:id',
        component: ChooseStoreModuleComponent,
      },
      {
        path: 'chooseStaff/:id',
        component: ChooseStaffServiceComponent,
      }
    ]),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    InlineSVGModule,
    DropdownMenusModule,
  ],
  entryComponents: [],
})
export class B9CustomersModule { }
