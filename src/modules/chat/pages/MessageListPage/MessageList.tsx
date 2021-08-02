import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil/dist";
import { messageListState } from "../../../../recoil/atoms/messages.atom";
import { animateScroll } from "react-scroll";
import MessageItem from "./MessageItem";
import { usePubNub } from "pubnub-react";
import { meState, selectedGirlState } from "../../../../recoil/atoms/users.atom";
import { pubnubChatsState, pubnubCurrentChannelMetadataState } from "../../../../recoil/atoms/pubnub.atom";

const MessageList = (props: any) => {
  const chatRef = useRef(null);

  const pubnub = usePubNub();

  const me = useRecoilValue(meState);
  const girl = useRecoilValue(selectedGirlState);
  const messageList = useRecoilValue(messageListState);
  const pubnubCurrentChannelMetadata = useRecoilValue(pubnubCurrentChannelMetadataState);
  const [pubnubChats, setPubnubChats] = useRecoilState(pubnubChatsState);

  function scrollToBottom() {
    animateScroll.scrollToBottom(chatRef.current)
  }

  // Scroll to bottom and send read receipt when receive new message
  useEffect(() => {
    (async function _() {
      if (messageList.length > 0) {
        scrollToBottom();

        const lastMessage = messageList[messageList.length - 1]
        // if (lastMessage?.actions?.receipt?.message_read &&
        //   lastMessage.actions.receipt.message_read.findIndex((item: any) =>
        //     (item.uuid === me?.uuid) && (item.uuid === girl?.uuid)) > -1)
        //   return;

        try {
          // add message action as read
          await pubnub.addMessageAction({
            channel: lastMessage.channel,
            messageTimetoken: lastMessage.timetoken,
            action: {
              type: 'receipt',
              value: 'message_read',
            }
          });
        } catch (e) {
          console.error("ADD MESSAGE ACTION", e)
        }

        try {
          // add lastReadTimeToken to membership
          if (me?.uuid && girl?.uuid && pubnubCurrentChannelMetadata?.id) {
            pubnub.objects.setMemberships({
              uuid: me.uuid,
              channels: [{
                id: pubnubCurrentChannelMetadata.id,
                custom: {
                  guy_uuid: me.uuid,
                  guy_name: `${me.name}`,
                  guy_photo_url: me.photos && me.photos.length > 0 ? me.photos[me.photos.length - 1] : '',
                  girl_uuid: girl.uuid,
                  girl_name: `${girl.name}`,
                  girl_photo_url: girl.photos && girl.photos.length > 0 ? girl.photos[girl.photos.length - 1] : '',
                  lastReadTimeToken: Date.now() * 10000
                }
              }],
              include: { customFields: true }
            })
          }
        } catch (e) {
          console.error("ADD LASTREADTIMETOKEN to MEMBERSHIP", e)
        }

        const indexOfCurrentChat = pubnubChats.findIndex(chat => chat.channel === pubnubCurrentChannelMetadata?.id);
        if (indexOfCurrentChat > -1) {
          const currentChat = pubnubChats[indexOfCurrentChat];
          setPubnubChats((oldPubnubChats) => [
            ...oldPubnubChats.slice(0, indexOfCurrentChat),
            {
              ...currentChat,
              lastMessage: {
                channel: lastMessage.channel,
                message: lastMessage.message,
                timetoken: lastMessage.timetoken,
                uuid: lastMessage.uuid,
                meta: lastMessage.meta,
              },
              unreadMessageCount: 0
            },
            ...oldPubnubChats.slice(indexOfCurrentChat + 1)
          ])
        }
      }
    }())
  }, [messageList]);

  return (
    <div ref={chatRef} className="flex flex-col flex-1 overflow-auto">
      {
        (messageList && messageList.length > 0) ? (
          messageList.map((message, i) => (
            <MessageItem message={message} key={i} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 font-light">
            There are no messages to show. 
            Send a message to {girl?.name} by typing your message at the bottom of the screen and press the Send button.
          </div>
        )
      }
    </div>
  )
};

export default MessageList;
