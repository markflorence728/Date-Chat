import { atom } from 'recoil';

export const loadingState = atom({
  key: 'loadingState',
  default: {
    loadingAccount: false,
    loadingGirlInfo: false,
    loadingChatList: false,
  }
});
