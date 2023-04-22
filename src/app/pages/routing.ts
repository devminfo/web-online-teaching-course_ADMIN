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
  {
    path: 'features/groupdetails',
    loadChildren: () =>
      import('../modules/base/b7-group-detail/b7-group-detail.module').then(
        (m) => m.B7GroupDetailModule
      ),
  },
  // ----------------------------
  // --------- features ---------
  // ----------------------------
  {
    path: 'features/banners',
    loadChildren: () =>
      import('../modules/features/f1-banner/banner.module').then(
        (m) => m.BannerModule
      ),
  },
  {
    path: 'features/courses',
    loadChildren: () =>
      import('../modules/features/f2-course/course.module').then(
        (m) => m.CourseModule
      ),
  },
  {
    path: 'features/chapters',
    loadChildren: () =>
      import('../modules/features/f3-chapter/chapter.module').then(
        (m) => m.ChapterModule
      ),
  },
  {
    path: 'features/lectures',
    loadChildren: () =>
      import('../modules/features/f4-lecture/lecture.module').then(
        (m) => m.LectureModule
      ),
  },
  {
    path: 'features/learningpaths',
    loadChildren: () =>
      import('../modules/features/f5-learning-path/learning-path.module').then(
        (m) => m.LearningPathModule
      ),
  },
  {
    path: 'features/categories',
    loadChildren: () =>
      import('../modules/features/f6-category/category.module').then(
        (m) => m.CategoryModule
      ),
  },
  {
    path: 'features/transactions',
    loadChildren: () =>
      import('../modules/common/c8-transaction/transaction.module').then(
        (m) => m.TransactionModule
      ),
  },
  {
    path: 'features/posts',
    loadChildren: () =>
      import('../modules/features/f7-post/post.module').then(
        (m) => m.PostModule
      ),
  },
  {
    path: 'features/comments',
    loadChildren: () =>
      import('../modules/features/f8-comment/comment.module').then(
        (m) => m.CommentModule
      ),
  },
  {
    path: 'features/conversations',
    loadChildren: () =>
      import('../modules/features/f9-conversation/conversation.module').then(
        (m) => m.ConversationModule
      ),
  },
  {
    path: 'features/messages',
    loadChildren: () =>
      import('../modules/features/f10-messages/message.module').then(
        (m) => m.MessageModule
      ),
  },
  {
    path: 'features/quizzes',
    loadChildren: () =>
      import('../modules/features/f11-quiz/quiz.module').then(
        (m) => m.QuizModule
      ),
  },
  {
    path: 'features/playquizzes',
    loadChildren: () =>
      import('../modules/features/f12-play-quizzes/play-quiz.module').then(
        (m) => m.PlayQuizModule
      ),
  },
  {
    path: 'features/classrooms',
    loadChildren: () =>
      import('../modules/features/f13-class-rooms/class-room.module').then(
        (m) => m.ClassRoomModule
      ),
  },
  {
    path: 'features/questions',
    loadChildren: () =>
      import('../modules/features/f14-questions/question.module').then(
        (m) => m.QuestionModule
      ),
  },
  {
    path: 'features/testquestions',
    loadChildren: () =>
      import('../modules/features/f15-test-question/test-question.module').then(
        (m) => m.TestQuestionModule
      ),
  },
  {
    path: 'features/usertests',
    loadChildren: () =>
      import('../modules/features/f16-user-test/user-test.module').then(
        (m) => m.UserTestModule
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
