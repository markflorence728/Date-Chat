import React from 'react';
import Loadable from 'react-loadable';
import PageLoader from '../common/components/PageLoader';

const loadable = (loader: any) =>
  Loadable({
    loader,
    delay: false,
    loading: () => <PageLoader />
  });

const routes = [
  {
    path: '/landing',
    component: loadable(() => import('../modules/LandingPage')),
    exact: true,
    required_auth: false
  },
  // Auth
  {
    path: '/login',
    component: loadable(() => import('../modules/auth/pages/LoginPage')),
    exact: true,
    required_auth: false
  },
  {
    path: '/signup',
    component: loadable(() => import('../modules/auth/pages/SignupPage')),
    exact: true,
    required_auth: false
  },
  {
    path: '/joinwaitinglist',
    component: loadable(() => import('../modules/auth/pages/JoinWaitingListPage')),
    exact: true,
    required_auth: false
  },
  {
    path: '/joinwaitinglistsuccess',
    component: loadable(() => import('../modules/auth/pages/JoinWaitingListSuccessPage')),
    exact: true,
    required_auth: false
  },
  {
    path: '/forgotpassword',
    component: loadable(() => import('../modules/auth/pages/ResetPasswordPage')),
    exact: true,
    required_auth: false
  },
  {
    path: '/resetpasswordsuccess',
    component: loadable(() => import('../modules/auth/pages/ResetPasswordSuccessPage')),
    exact: true,
    required_auth: false
  },

  // Settings
  {
    path: '/settings',
    component: loadable(() => import('../modules/user/pages/ProfilePage')),
    exact: true,
    required_auth: true
  },

  {
    path: '/upload',
    component: loadable(() => import('../modules/user/pages/ImageCropPage')),
    exact: true,
    required_auth: true
  },

  // Date
  {
    path: '/dashboard',
    component: loadable(() => import('../modules/date/pages/DashboardPage')),
    exact: true,
    required_auth: true
  },
  {
    path: '/girl/:uuid/detail',
    component: loadable(() => import('../modules/date/pages/GirlDetailPage')),
    exact: true,
    required_auth: true
  },
  {
    path: '/chat/channels',
    component: loadable(() => import('../modules/chat/pages/ChannelListPage')),
    exact: true,
    required_auth: true
  },
  {
    path: '/chat/messages',
    component: loadable(() => import('../modules/chat/pages/MessageListPage')),
    exact: true,
    required_auth: true
  }
];

export default routes;
