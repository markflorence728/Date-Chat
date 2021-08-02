import { atom } from 'recoil';

export enum AlertSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export const notificationState = atom({
  key: 'notificationState',
  default: {
    severity: '' as AlertSeverity,
    message: '',
    open: false,
  }
});