import { atom } from 'recoil';
import { ChannelMembershipObject, ChannelMetadataObject, ObjectCustom, SignalEvent, UUIDMetadataObject } from "pubnub";

export interface PubnubChat {
  channel: string;
  guy: { uuid: string; name: string; photo_url: string; status?: string; [key: string]: any;  };
  girl: { uuid: string; name: string; photo_url: string; status?: string; [key: string]: any;  };
  lastMessage: { channel: string; message: any; timetoken: string | number; uuid?: string, meta?: { [key: string]: any; } } | null;
  unreadMessageCount: number;
}

export const pubnubUUIDMetadataState = atom({
  key: 'pubnubUUIDMetadataState',
  default: null as UUIDMetadataObject<ObjectCustom> | null
});

export const pubnubAllUUIDMetadataState = atom({
  key: 'pubnubAllUUIDMetadataState',
  default: [] as UUIDMetadataObject<ObjectCustom>[]
});

export const pubnubMembershipsState = atom({
  key: 'pubnubMembershipsState',
  default: [] as ChannelMembershipObject<any, any>[],
});

export const pubnubChatsState = atom({
  key: 'pubnubChatsState',
  default: [] as PubnubChat[]
});

export const pubnubCurrentChannelMetadataState = atom({
  key: 'pubnubCurrentChannelMetadataState',
  default: null as ChannelMetadataObject<ObjectCustom> | null
});

export const pubnubCurrentChannelSignalState = atom({
  key: 'pubnubCurrentChannelSignalState',
  default: null as SignalEvent | null
});
