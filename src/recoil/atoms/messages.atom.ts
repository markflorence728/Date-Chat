import { atom } from 'recoil';

export const messageTextState = atom({
  key: 'messageState',
  default: '' as string
});

export const messageListState = atom({
  key: 'messageListState',
  default: [] as any[]
});

export const messageReceiptState = atom({
  key: 'messageReceiptState',
  default: {
    message_delivered: '',
    message_read: '',
  }
});
