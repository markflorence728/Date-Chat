import React, { useEffect, useState } from 'react';
import { useGlobalStyles } from "../../../../common/material/globalStyles";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { Container } from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil/dist";
import { meState, selectedGirlState } from "../../../../recoil/atoms/users.atom";
import { usePubNub } from "pubnub-react";
import {
  pubnubChatsState,
  pubnubCurrentChannelMetadataState,
  pubnubCurrentChannelSignalState,
  pubnubMembershipsState
} from "../../../../recoil/atoms/pubnub.atom";
import MessageHeader from "./MessageHeader";
import clsx from "clsx";
import { messageListState } from "../../../../recoil/atoms/messages.atom";
import ClipLoader from "react-spinners/ClipLoader";
import { ConsoleService } from "../../../../common/services/console.service";
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    zIndex: 10,
    height: '100%',
  }
}))

const MessageListPage = (props: any) => {
  const gClasses = useGlobalStyles();
  const classes = useStyles();
  const history = useHistory();
  const me = useRecoilValue(meState);
  const girl = useRecoilValue(selectedGirlState);
  const [pubnubCurrentChannelMetadata, setPubnubCurrentChannelMetadata] = useRecoilState(pubnubCurrentChannelMetadataState);
  const setPubnubMemberships = useSetRecoilState(pubnubMembershipsState);
  const setPubnubChats = useSetRecoilState(pubnubChatsState);
  const setMessageList = useSetRecoilState(messageListState);
  const setPubnubCurrentChannelSignal = useSetRecoilState(pubnubCurrentChannelSignalState);
  const [channelLoading, setChannelLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const pubnub = usePubNub();

  const getChannel = async () => {
    if(!me?.uuid || !girl?.uuid || !girl?.admin_id) {
      history.push('/chat/channels')
      return;
    }

    try {
      const resp = await pubnub.objects.getChannelMetadata({
        channel: `${me?.uuid?.slice(0, 23)}_${girl?.admin_id}_${girl?.uuid?.slice(0, 23)}`
      });
      setPubnubCurrentChannelMetadata(resp.data);

      return;
    } catch (e) {
      ConsoleService.error("GET PUBNUB CHANNEL METADATA", e)
    }

    await createChannel();
  }

  const createChannel = async () => {
    if (!me?.uuid || !girl?.uuid || !girl?.admin_id) {
      return;
    }

    try {
      const resp = await pubnub.objects.setChannelMetadata({
        channel: `${me.uuid.slice(0, 23)}_${girl.admin_id}_${girl.uuid.slice(0, 23)}`,
        data: {
          name: `${me.name}, ${girl.name}`,
          description: `${me.uuid},${girl.uuid}`
        }
      })

      await Promise.all([
        pubnub.objects.setChannelMembers({
          channel: resp.data.id,
          uuids: [me.uuid, girl.admin_id]
        }),
        setMemberships(resp.data.id)
      ])

      setPubnubCurrentChannelMetadata(resp.data);
    } catch (e) {
      ConsoleService.error("SET CHANNEL METADATA & SET CHANNEL", e)
    }
  }

  const setMemberships = async (channel: string) => {
    if (!me?.uuid || !girl?.uuid || !girl?.admin_id) {
      return
    }

    try {
      const [respMemberships, _] = await Promise.all([
        pubnub.objects.setMemberships({
          uuid: me.uuid,
          channels: [{
            id: channel,
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
        }),
        pubnub.objects.setMemberships({
          uuid: girl.admin_id,
          channels: [{
            id: channel,
            custom: {
              guy_uuid: me.uuid,
              guy_name: `${me.name}`,
              guy_photo_url: me.photos && me.photos.length > 0 ? me.photos[me.photos.length - 1] : '',
              girl_uuid: girl.uuid,
              girl_name: `${girl.name}`,
              girl_photo_url: girl.photos && girl.photos.length > 0 ? girl.photos[girl.photos.length - 1] : '',
              lastReadTimeToken: Date.now() * 10000
            }
          }]
        }),
      ]);

      if (respMemberships && respMemberships.data.length > 0) {
        const membership = respMemberships.data[0];

        setPubnubMemberships((oldPubnubMemberships) => [
          ...oldPubnubMemberships,
          membership
        ]);
  
        setPubnubChats((oldPubnubChats) => [
          ...oldPubnubChats,
          {
            channel: membership.channel.id,
            guy: {
              uuid: membership.custom?.guy_uuid as string || '',
              name: membership.custom?.guy_name as string || '',
              photo_url: membership.custom?.guy_photo_url as string || '',
            },
            girl: {
              uuid: membership.custom?.girl_uuid as string || '',
              name: membership.custom?.girl_name as string || '',
              photo_url: membership.custom?.girl_photo_url as string || '',
            },
            lastMessage: null,
            unreadMessageCount: 0
          }
        ])
      }
    } catch (e) {
      ConsoleService.error("SET PUBNUB MEMBERSHIPS", e)
    }
  }

  const leaveCurrentChannel = () => {
    setMessageList([]);
    setPubnubCurrentChannelMetadata(null);
    setPubnubCurrentChannelSignal(null);
  }

  useEffect(() => {
    (async function _() {
      setMessageList([]);

      setChannelLoading(true);
      await getChannel();
      setChannelLoading(false);
    }())

    return leaveCurrentChannel;
  }, [])

  // get messages of current channel
  useEffect(() => {
    if (!pubnubCurrentChannelMetadata) {
      return;
    }

    (async function _() {
      setMessageList([])

      setMessageLoading(true);
      try {
        const resp = await pubnub.fetchMessages({
          channels: [pubnubCurrentChannelMetadata.id],
          includeMeta: true,
          includeMessageActions: true,
        });

        if (pubnubCurrentChannelMetadata.id in resp.channels) {
          setMessageList(resp.channels[pubnubCurrentChannelMetadata.id])
        } else {
          setMessageList([])
        }
      } catch (e) {
        ConsoleService.error('FETCH MESSAGES', e)
      }
      setMessageLoading(false);
    }());

    pubnub.subscribe({
      channels: [pubnubCurrentChannelMetadata.id],
      withPresence: true
    });
  }, [pubnubCurrentChannelMetadata])

  return (
    <>
      <MessageHeader {...props} />
      <Container
        className={clsx(gClasses.mainContainer, gClasses.headContainer, gClasses.footContainer)}
        maxWidth="lg"
      >
        <div className={clsx(classes.root, "flex flex-1 flex-col relative")}>
          {channelLoading || messageLoading ? (
            <div className="text-center">
              <ClipLoader size={32} color="#ff4b4b" loading />
            </div>
          ) : (
            <MessageList />
          )}
          <MessageInput />
        </div>
      </Container>
    </>
  );
};

export default MessageListPage;
