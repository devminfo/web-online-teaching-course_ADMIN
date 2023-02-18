import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { OverviewComponent } from './overview/overview.component';
import { ProfileGroupsComponent } from './groups/groups.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../../template/partials';
import { SettingsComponent } from './settings/settings.component';
import { ProfileDetailsComponent } from './settings/forms/profile-details/profile-details.component';
import { SignInMethodComponent } from './settings/forms/sign-in-method/sign-in-method.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    ProfileGroupsComponent,
    SettingsComponent,
    ProfileDetailsComponent,
    SignInMethodComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}
