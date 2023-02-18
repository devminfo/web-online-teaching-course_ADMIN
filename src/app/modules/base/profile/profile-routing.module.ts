import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ProfileGroupsComponent } from './groups/groups.component';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'groups',
        component: ProfileGroupsComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
