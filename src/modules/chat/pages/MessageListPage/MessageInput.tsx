import React, { useState } from "react";
import { IconButton, InputBase, Paper, Chip } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useRecoilState, useRecoilValue } from "recoil/dist";
import { messageTextState } from "../../../../recoil/atoms/messages.atom";
import { usePubNub } from "pubnub-react";
import {
  pubnubCurrentChannelMetadataState,
  pubnubCurrentChannelSignalState,
  pubnubUUIDMetadataState
} from "../../../../recoil/atoms/pubnub.atom";
import clsx from "clsx";
import { meState } from "../../../../recoil/atoms/users.atom";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    left: theme.spacing(0),
    padding: theme.spacing(1),
  },
  paper: {
    borderRadius: theme.spacing(3),
  },
}))

const MessageInput = (props: any) => {
  const classes = useStyles();

  const pubnub = usePubNub();

  const [messageText, setMessageText] = useRecoilState(messageTextState);
  const me = useRecoilValue(meState);
  const pubnubUUIDMetadata = useRecoilValue(pubnubUUIDMetadataState);
  const pubnubCurrentChannelMetadata = useRecoilValue(pubnubCurrentChannelMetadataState);
  const pubnubCurrentChannelSignal = useRecoilValue(pubnubCurrentChannelSignalState);
  const [typing, setTyping] = useState({ typing: false, timestamp: Date.now() });

  const startTyping = async () => {
    if (!typing.typing) {
      setTyping({
        typing: true,
        timestamp: Date.now()
      })
      await pubnub.signal({
        message: "typing_on",
        channel: pubnubCurrentChannelMetadata?.id || ""
      });
    }
  }

  const endTyping = async () => {
    if (typing.typing) {
      setTyping({
        typing: false,
        timestamp: Date.now()
      })
      await pubnub.signal({
        message: "typing_off",
        channel: pubnubCurrentChannelMetadata?.id || ""
      });
    }
  }

  const onMessageSubmit = async () => {
    await endTyping();

    if (!messageText) return;

    await pubnub.publish({
      channel: pubnubCurrentChannelMetadata?.id || "",
      message: messageText,
      meta: {
        name: pubnubUUIDMetadata?.name,
        profileUrl: pubnubUUIDMetadata?.profileUrl,
        externalId: pubnubUUIDMetadata?.externalId,
      }
    });

    setMessageText('');
  }

  const onInputChange = async (ev: any) => {
    setMessageText(ev.target.value);

    setTyping({
      typing: true,
      timestamp: Date.now()
    })
    await startTyping();
  }

  return (
    <div className={classes.root}>
      {
        pubnubCurrentChannelSignal?.publisher !== me?.uuid && pubnubCurrentChannelSignal?.message === 'typing_on'
        && <Chip className="ml-2" size="small" label="typing..." />
      }

      <Paper className={clsx(classes.paper, "flex align-middle relative pl-4")} elevation={1}>
        <InputBase
          className="flex-1"
          autoFocus={false}
          placeholder="Type your message"
          onChange={onInputChange}
          value={messageText}
        />
        <IconButton onClick={onMessageSubmit}>
          <SendIcon className="text-xl" />
        </IconButton>
      </Paper>
    </div>
  )
};

export default MessageInput;
