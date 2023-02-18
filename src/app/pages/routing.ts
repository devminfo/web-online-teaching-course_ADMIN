import { F13StoreTemplateModule } from '../modules/features/f13-store-template/f13-store-template.module';
import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/base/sample/account/account.module').then(
        (m) => m.AccountModule
      ),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/common/wizards/wizards.module').then(
        (m) => m.WizardsModule
      ),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/common/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/common/capps/chat/chat.module').then(
        (m) => m.ChatModule
      ),
  },

  // Profile
  {
    path: 'profile',
    loadChildren: () =>
      import('../modules/base/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
  },

  // Account
  {
    path: 'features/users',
    loadChildren: () =>
      import('../modules/base/b2-users/b2-users.module').then(
        (m) => m.B2UsersModule
      ),
  },
  
  {
    path: 'features/groups',
    loadChildren: () =>
      import('../modules/base/b8-group/b8-group.module').then(
        (m) => m.B8GroupModule
      ),
  },
  {
    path: 'features/group-details',
    loadChildren: () =>
      import('../modules/base/b8-group/b8-group.module').then(
        (m) => m.B8GroupModule
      ),
  },
  

  // Common
  {
    path: 'features/dashboards',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'features/backupdatas',
    loadChildren: () =>
      import('../modules/common/c1-backup/c1-backup.module').then(
        (m) => m.C1BackupModule
      ),
  },
  {
    path: 'features/histories',
    loadChildren: () =>
      import('../modules/common/c2-histories/c2-history.module').then(
        (m) => m.C2HistoryModule
      ),
  },
  {
    path: 'features/filemanager',
    loadChildren: () =>
      import('../modules/common/c3-filemanager/c3-file-manager.module').then(
        (m) => m.C4FileManagerModule
      ),
  },
  {
    path: 'features/otps',
    loadChildren: () =>
      import('../modules/common/c4-otps/c4-otps.module').then(
        (m) => m.C4OtpModule
      ),
  },

  {
    path: 'features/provinces',
    loadChildren: () =>
      import('../modules/common/c5-provinces/c5-province.module').then(
        (m) => m.C5ProvinceModule
      ),
  },

  {
    path: 'features/districts',
    loadChildren: () =>
      import('../modules/common/c6-districts/c6-district.module').then(
        (m) => m.C6DistrictModule
      ),
  },

  {
    path: 'features/villages',
    loadChildren: () =>
      import('../modules/common/c7-wards/c7-ward.module').then(
        (m) => m.C7WardModule
      ),
  },
  {
    path: 'common/settings',
    loadChildren: () =>
      import('../modules/common/c13-settings/c13-settings.module').then(
        (m) => m.C13SettingsModule
      ),
  },

  {
    path: 'features/cron-jobs',
    loadChildren: () =>
      import('../modules/common/c8-cron-jobs/c8-cron-job.module').then(
        (m) => m.C8CronJobModule
      ),
  },

  // Authorization
  {
    path: 'features/freeapis',
    loadChildren: () =>
      import('../modules/base/b3-free-api/b3-free-api.module').then(
        (m) => m.B3FreeAPIModule
      ),
  },
  {
    path: 'features/authuseraccesses',
    loadChildren: () =>
      import(
        '../modules/base/b4-auth-user-access/b4-auth-user-access.module'
      ).then((m) => m.B4AuthUserAccessModule),
  },
  {
    path: 'features/authuserids',
    loadChildren: () =>
      import('../modules/base/b5-auth-user-id/b5-auth-user-id.module').then(
        (m) => m.B5AuthUserIdModule
      ),
  },
  {
    path: 'features/groupapis',
    loadChildren: () =>
      import('../modules/base/b6-group-api/b6-group-api.module').then(
        (m) => m.B6GroupAPIModule
      ),
  },
  // features
  {
    path:'features/vouchertemplatedefaults',
    loadChildren:()=>
      import('../modules/features/f8-voucher-templalte-default/f8-voucher-template-default.module').then(
        (m)=> m.F8VoucherTemplateDefaultModule
      )
  },
  {
    path: 'features/assetspackages',
    loadChildren: () =>
      import('../modules/features/f10-assets-packages/f10-assets-packages.module').then(
        (m) => m.F10AssetsPackagesModule
      ),
  },
  {
    path: 'features/storetemplates',
    loadChildren: () =>
      import('../modules/features/f13-store-template/f13-store-template.module').then(
        (m) => m.F13StoreTemplateModule
      ),
  },
  {
    path: 'features/storepackagetransactions',
    loadChildren: () =>
      import('../modules/features/f11-store-package-transactions/f11-store-package-transactions.module').then(
        (m) => m.F11StorePackageTransactionsModule
      ),
  },
  {
    path: 'features/servicesorders',
    loadChildren: () =>
      import('../modules/features/f5-service-orders/f5-service-orders.module').then(
        (m) => m.F5ServiceOrdersModule
      ),
  },
  {
    path: 'features/groupdetails',
    loadChildren: () =>
      import('../modules/base/b7-group-detail/b7-group-detail.module').then(
        (m) => m.B7GroupDetailModule
      ),
  },
  {
    path: 'features/customers',
    loadChildren: () =>
      import('../modules/base/b9-customers/b9-customers.module').then(
        (m) => m.B9CustomersModule
      ),
  },


  {
    path: 'features/specializes',
    loadChildren: () =>
      import('../modules/features/f1-specialize/f1-specialize.module').then(
        (m) => m.F1SpecializeModule
      ),
  },
  {
    path: 'features/subspecializes',
    loadChildren: () =>
      import(
        '../modules/features/f2-sub-specialize/f2-sub-specialize.module'
      ).then((m) => m.F2SubSpecializeModule),
  },

  {
    path: 'features/userspecializes',
    loadChildren: () =>
      import(
        '../modules/features/f3-user-specialize/f3-user-specialize.module'
      ).then((m) => m.F3UserSpecializeModule),
  },
  {
    path: 'features/subjects',
    loadChildren: () =>
      import('../modules/features/f4-subject/f4-subject.module').then(
        (m) => m.F4SubjectModule
      ),
  },
  {
    path: 'features/certificates',
    loadChildren: () =>
      import('../modules/features/f5-certificate/f5-certificate.module').then(
        (m) => m.F5CertificateModule
      ),
  },
  {
    path: 'features/quizzes',
    loadChildren: () =>
      import('../modules/features/f6-quiz/f6-quiz.module').then(
        (m) => m.F6QuizModule
      ),
  },
  {
    path: 'features/historyquizzes',
    loadChildren: () =>
      import('../modules/features/f7-historyquiz/f7-historyquiz.module').then(
        (m) => m.F7HistoryQuizModule
      ),
  },
  {
    path: 'features/transactions',
    loadChildren: () =>
      import('../modules/features/f9-transaction/f9-transaction.module').then(
        (m) => m.F9TransactionModule
      ),
  },
  {
    path: 'features/notifications',
    loadChildren: () =>
      import(
        '../modules/features/f10-notification/f10-notification.module'
      ).then((m) => m.F10NotificationModule),
  },
  {
    path: 'features/reviews',
    loadChildren: () =>
      import('../modules/features/f11-reviews/f11-reviews.module').then(
        (m) => m.F11ReviewsModule
      ),
  },
  {
    path: 'features/settings',
    loadChildren: () =>
      import('../modules/features/f12-setting/f12-setting.module').then(
        (m) => m.F12SettingModule
      ),
  },
  {
    path: 'features/groupservices',
    loadChildren: () =>
      import('../modules/features/f13-group-services/f13-group-services.module').then(
        (m) => m.F13GroupServicesModule
      )
  },
  {
    path: 'features/stores',
    loadChildren: () =>
      import('../modules/features/f16-store/f16-store.module').then(
        (m) => m.F16StoreModule
      ),
  },
  {
    path: 'features/storeservicestemplate',
    loadChildren: () =>
      import('../modules/features/f18-store-services-template/f18-store-services-template.module').then(
        (m) => m.F18StoreServicesTemplateModule
      ),
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
