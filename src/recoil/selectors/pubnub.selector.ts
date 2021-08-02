import { selector } from 'recoil';
import { pubnubChatsState } from '../atoms/pubnub.atom';

export const sortPubnubChatListState = selector({
  key: 'allPubnubChatListState',
  get: ({ get }) => {
    const chats = get(pubnubChatsState);

    return chats.slice().sort((c1, c2) => {
      if (c2.lastMessage?.timetoken && c1.lastMessage?.timetoken) {
        return c2.lastMessage.timetoken > c1.lastMessage.timetoken
          ? 1
          : c1.lastMessage.timetoken > c2.lastMessage.timetoken
          ? -1
          : 0;
      }

      if (c2.lastMessage?.timetoken) {
        return 1;
      }

      if (c1.lastMessage?.timetoken) {
        return -1;
      }

      return 0;
    });
  }
});

export const getUnreadChannelCountState = selector({
  key: 'getUnreadChannelCountState',
  get: ({ get }) => {
    const chats = get(pubnubChatsState);
    return chats.filter(chat => chat.unreadMessageCount > 0).length;
  }
});
