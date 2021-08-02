import React, { useCallback, useEffect, useRef } from 'react';
import { MessageAction, ObjectsEvent, PresenceEvent, SignalEvent, StatusEvent } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  pubnubAllUUIDMetadataState,
  pubnubChatsState,
  pubnubCurrentChannelMetadataState,
  pubnubCurrentChannelSignalState,
  pubnubMembershipsState,
  pubnubUUIDMetadataState,
} from "./recoil/atoms/pubnub.atom";
import { 
  messageListState, 
  messageReceiptState, 
} from "./recoil/atoms/messages.atom";
import {
  CMessageActionEvent,
  CMessageEvent,
  getLastReadMessageTimeToken,
  getMaxReceiptTimeToken
} from "./@pubnub/helpers";
import { ConsoleService } from "./common/services/console.service";
import { loadingState } from './recoil/atoms/loading.atom';

const PubnubComponent = () => {
  const pubnub = usePubNub();

  const setLoading = useSetRecoilState(loadingState);

  const [
    [pubnubUUIDMetadata, setPubnubUUIDMetadata],                      // pubnub current user info state
    [pubnubAllUUIDMetadata, setPubnubAllUUIDMetadata],                // pubnub info list state of all user.
    [pubnubCurrentChannelMetadata, setPubnubCurrentChannelMetadata],  // pubnub channel info state of current opened chat
    [pubnubCurrentChannelSignal, setPubnubCurrentChannelSignal],      // pubnub typing state
    [pubnubMemberships, setPubnubMemberships],                        // pubnub current user's memberships state.
    [pubnubChats, setPubnubChats]                                     // pubnub current user's channels state. (channel, user, last_message, unread_message_count)
  ] = [
    useRecoilState(pubnubUUIDMetadataState),
    useRecoilState(pubnubAllUUIDMetadataState),
    useRecoilState(pubnubCurrentChannelMetadataState),
    useRecoilState(pubnubCurrentChannelSignalState),
    useRecoilState(pubnubMembershipsState),
    useRecoilState(pubnubChatsState)
  ];

  const [
    latestPubnubUUIDMetadata,
    latestPubnubAllUUIDMetadata,
    latestPubnubCurrentChannelMetadata,
    latestPubnubCurrentChannelSignal,
    latestPubnubMemberships,
    latestPubnubChats
  ] = [
    useRef(pubnubUUIDMetadata),
    useRef(pubnubAllUUIDMetadata),
    useRef(pubnubCurrentChannelMetadata),
    useRef(pubnubCurrentChannelSignal),
    useRef(pubnubMemberships),
    useRef(pubnubChats)
  ];

  const [
    [messageList, setMessageList],                                    // message list state of current opened channel
    [messageReceipt, setMessageReceipt],                              // last receipts state of current opened channel (message_delivered, message_read)
  ] = [
    useRecoilState(messageListState),
    useRecoilState(messageReceiptState),
  ];

  const [
    latestMessageList,
    latestMessageReceipt,
  ] = [
    useRef(messageList),
    useRef(messageReceipt)
  ]

  // logs of pubnub recoil states
  useEffect(() => {
    ConsoleService.log({
      'pubnubUUIDMetadata': pubnubUUIDMetadata,
      'pubnubAllUUIDMetadata': pubnubAllUUIDMetadata,
      'pubnubCurrentChannelMetadata': pubnubCurrentChannelMetadata,
      'pubnubCurrentChannelSignal': pubnubCurrentChannelSignal,
      'pubnubMemberships': pubnubMemberships,
      'pubnubChats': pubnubChats,
    });

    latestPubnubUUIDMetadata.current = pubnubUUIDMetadata;
    latestPubnubAllUUIDMetadata.current = pubnubAllUUIDMetadata;
    latestPubnubCurrentChannelMetadata.current = pubnubCurrentChannelMetadata;
    latestPubnubCurrentChannelSignal.current = pubnubCurrentChannelSignal;
    latestPubnubMemberships.current = pubnubMemberships;
    latestPubnubChats.current = pubnubChats;
  }, [
    pubnubUUIDMetadata,
    pubnubAllUUIDMetadata,
    pubnubCurrentChannelMetadata,
    pubnubCurrentChannelSignal,
    pubnubMembershipsState,
    pubnubChats
  ]);

  // logs of message recoil states
  useEffect(() => {
    ConsoleService.log({
      'Message List': messageList,
      'Message Receipt': messageReceipt,
    });

    latestMessageList.current = messageList;
    latestMessageReceipt.current = messageReceipt;
  }, [messageList, messageReceipt]);

  // get last receipts state
  useEffect(() => {
    const myUuid = pubnub.getUUID();
    const message_delivered = getMaxReceiptTimeToken(messageList, 'message_delivered', myUuid);
    const message_read = getMaxReceiptTimeToken(messageList, 'message_read', myUuid);

    setMessageReceipt({
      message_delivered,
      message_read,
    })
  }, [messageList])

  // init pubnub chats(channels data)
  useEffect(() => {
    (async function _() {
      setLoading((oldLoading) => ({
        ...oldLoading,
        loadingChatList: true
      }))

      if (pubnubUUIDMetadata?.id) {
        try {
          const myUuid = pubnub.getUUID();

          // get user's channels
          const respMemberships = await pubnub.objects.getMemberships({
            uuid: myUuid,
            include: { customFields: true }
          });
          const memberships: any[] = [];

          // Remove Invalid Channel
          respMemberships.data.forEach(membership => {    
            // pubnub.objects.removeChannelMetadata({
            //   channel: membership.channel.id
            // })
            
            // pubnub.objects.removeMemberships({
            //   uuid: myUuid,
            //   channels: [membership.channel.id],
            // });

            if (!membership.channel.id.includes(myUuid.slice(0, 23))) {
              pubnub.objects.removeMemberships({
                uuid: myUuid,
                channels: [membership.channel.id],
              });
            } else {
              memberships.push(membership);
            }
          });
          setPubnubMemberships([...memberships]);

          const channels: string[] = [];
          const channelCustomData: { [key: string]: any; } = {};
          const lastReadTimeTokens: number[] = [];
          memberships.forEach(membership => {
            channels.push(membership.channel.id);
            channelCustomData[membership.channel.id] = { ...membership.custom };
            if (membership?.custom?.lastReadTimeToken) {
              if (['string', 'number'].includes(typeof membership.custom.lastReadTimeToken)) {
                lastReadTimeTokens.push(Number(membership.custom.lastReadTimeToken));
              } else {
                lastReadTimeTokens.push(Date.now() * 10000)
              }
            } else {
              lastReadTimeTokens.push(Date.now() * 10000)
            }
          });

          await Promise.all(Object.keys(channelCustomData).map(async (channel) => {
            try {
              const respState = await pubnub.getState({
                uuid: channelCustomData[channel].uuid,
                channels: [channel]
              });
              channelCustomData[channel] = {
                ...channelCustomData[channel],
                ...respState.channels[channel]
              }
            } catch (e) {
              ConsoleService.error('PUBNUB GET STATE', e)
            }
          }));

          // get last messages
          const respLastMessages = await pubnub.fetchMessages({
            channels,
            count: 1,
            includeMeta: true,
          });

          // // get unread message count of each channel
          // const lastReadTimeTokens = await Promise.all(channels.map(async (channel) => {
          //   const respMessageActions = await pubnub.getMessageActions({ channel });
          //   const messageActions = respMessageActions.data as MessageAction[];
          //   return getLastReadMessageTimeToken(messageActions, myUuid);
          // }));

          const respUnreadMessageCounts = await pubnub.messageCounts({
            channels,
            channelTimetokens: [...lastReadTimeTokens],
          });

          // init chats state
          setPubnubChats(channels.map(channel => {
            return {
              channel,
              guy: {
                uuid: channelCustomData[channel].guy_uuid,
                name: channelCustomData[channel].guy_name,
                photo_url: channelCustomData[channel].guy_photo_url,
              },
              girl: {
                uuid: channelCustomData[channel].girl_uuid,
                name: channelCustomData[channel].girl_name,
                photo_url: channelCustomData[channel].girl_photo_url,
              },
              lastMessage: encodeURIComponent(channel) in respLastMessages.channels ? (
                respLastMessages.channels[encodeURIComponent(channel)].length > 0 ? respLastMessages.channels[encodeURIComponent(channel)][0] : null
              ) : null,
              unreadMessageCount: respUnreadMessageCounts.channels[channel]
            }
          }))

          // subscribe all channels
          pubnub.subscribe({
            channels,
            withPresence: true
          })
        } catch (e) {
          ConsoleService.error(e)
        }
      } else {
        setPubnubChats([])
      }

      setLoading((oldLoading) => ({
        ...oldLoading,
        loadingChatList: false
      }))
    }());
  }, [pubnubUUIDMetadata]);

  // add pubnub listeners
  useEffect(() => {
    pubnub.addListener({
      status: pubnubStateListener,
      message: pubnubMessageListener,
      presence: pubnubPresenceListener,
      signal: pubnubSignalListener,
      messageAction: pubnubMessageActionListener,
      objects: pubnubObjectsListener,
    });
  }, []);

  const pubnubStateListener = useCallback(async (statusEvent: StatusEvent) => {
    ConsoleService.log('Pubnub Status Listener', statusEvent);

    if (statusEvent.category === "PNConnectedCategory") {
      if (statusEvent.operation === "PNSubscribeOperation") {
        const newState = {
          status: "active",
        };
        await pubnub.setState({
          channels: statusEvent.affectedChannels,
          channelGroups: statusEvent.affectedChannelGroups,
          state: newState
        })
      }

      if (statusEvent.operation === "PNUnsubscribeOperation") {
        const newState = {
          status: "inactive",
        };
        await pubnub.setState({
          channels: statusEvent.affectedChannels,
          channelGroups: statusEvent.affectedChannelGroups,
          state: newState
        })
      }
    }
  }, []);

  const pubnubMessageListener = useCallback(async (messageEvent: CMessageEvent) => {
    // If message is one of opened channel, add it to message list
    if (messageEvent.channel === latestPubnubCurrentChannelMetadata.current?.id) {
      setMessageList((oldMessageList) => [
        ...oldMessageList,
        {
          channel: messageEvent.channel,
          message: messageEvent.message,
          timetoken: messageEvent.timetoken,
          uuid: messageEvent.publisher,
          meta: messageEvent.userMetadata,
        }
      ]);
    }

    // add message action as delivered
    await pubnub.addMessageAction({
      channel: messageEvent.channel,
      messageTimetoken: messageEvent.timetoken,
      action: {
        type: 'receipt',
        value: 'message_delivered',
      }
    });

    // increase and update the unread message count and last message of each channel
    const indexOfReceivedChat = latestPubnubChats.current.findIndex(chat => chat.channel === messageEvent.channel);
    if (indexOfReceivedChat > -1) {
      const receivedChat = latestPubnubChats.current[indexOfReceivedChat];
      let unreadMessageCount = receivedChat.unreadMessageCount;
      if (latestPubnubCurrentChannelMetadata.current?.id === messageEvent.channel) {
        unreadMessageCount = 0
      } else {
        if (messageEvent.publisher !== pubnub.getUUID()) {
          unreadMessageCount++
        }
      }
      setPubnubChats((oldPubnubChats) => [
        ...oldPubnubChats.slice(0, indexOfReceivedChat),
        {
          ...receivedChat,
          lastMessage: {
            channel: messageEvent.channel,
            message: messageEvent.message,
            timetoken: messageEvent.timetoken,
            uuid: messageEvent.publisher,
            meta: messageEvent.userMetadata,
          },
          unreadMessageCount
        },
        ...oldPubnubChats.slice(indexOfReceivedChat + 1)
      ])
    }
  }, []);

  const pubnubPresenceListener = useCallback(async (presenceEvent: PresenceEvent) => {
    // track and manage online/offline status of users and devices in realtime (by subscribe and unsubscribe channels)
    const index = latestPubnubChats.current.findIndex(chat =>
      chat.channel === presenceEvent.channel /* && chat.girl.uuid === presenceEvent.uuid */);
    if (index > -1) {
      const chat = latestPubnubChats.current[index];

      let status = "";
      if (presenceEvent.action === "join") {
        status = "online"
      } else if (presenceEvent.action === "state-change") {
        status = presenceEvent.state.status
      } else { // "leave" || "timeout"
        status = "offline"
      }

      setPubnubChats((oldPubnubChats) => [
        ...oldPubnubChats.slice(0, index),
        {
          ...chat,
          girl: { ...chat.girl, status },
        },
        ...oldPubnubChats.slice(index + 1)
      ])
    }
  }, []);

  const pubnubSignalListener = useCallback(async (signalEvent: SignalEvent) => {
    if (signalEvent.channel === latestPubnubCurrentChannelMetadata.current?.id) {
      setPubnubCurrentChannelSignal(signalEvent);
    }

    // TODO - track and manage typing or other status in channel in realtime
  }, []);

  const pubnubMessageActionListener = useCallback(async (messageActionEvent: CMessageActionEvent) => {
    const data: any = messageActionEvent.data
    if (messageActionEvent.publisher !== pubnub.getUUID()) {
      setMessageReceipt((oldMessageReceipt) => ({
        message_delivered: data.value === 'message_delivered' ? data.messageTimetoken : oldMessageReceipt.message_delivered,
        message_read: data.value === 'message_read' ? data.messageTimetoken : oldMessageReceipt.message_read
      }))
    }

    // TODO - update last action of corresponded channel
    // TODO - update unread message count of corresponded channel
  }, []);

  const pubnubObjectsListener = useCallback(async (objectsEvent: ObjectsEvent) => {
    ConsoleService.log('Pubnub Object Event', objectsEvent)
  }, [])


  return (
    <></>
  );
}

export default PubnubComponent;
