import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { AuthGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/base/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/common/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./template/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
