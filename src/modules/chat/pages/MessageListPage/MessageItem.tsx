import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useRecoilValue } from "recoil/dist";
import { meState, selectedGirlState } from "../../../../recoil/atoms/users.atom";
import clsx from "clsx";
import { Typography } from "@material-ui/core";
import CAvatar from "../../../../common/components/CAvatar";
import { messageListState, messageReceiptState } from "../../../../recoil/atoms/messages.atom";
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { formatMessageTime } from "../../helper";

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    padding: '.5rem 1rem',
    borderRadius: theme.spacing(3),
    fontWeight: 400,
  },
  myText: {
    backgroundColor: '#EAEAEA',
    color: '#777777'
  },
  friendText: {
    backgroundColor: '#FF5156',
    color: '#FFFFFF'
  },
  datetimeText: {
    color: '#BBBBBB'
  },
  receiptIcon: {
    width: '14px',
    height: '14px',
    marginLeft: '2px'
  }
}))

const MessageItem = (props: any) => {
  const classes = useStyles();

  const { message } = props;
  const me = useRecoilValue(meState);
  const girl = useRecoilValue(selectedGirlState);
  const messageReceipt = useRecoilValue(messageReceiptState);
  const messageList = useRecoilValue(messageListState);

  const [showTime, setShowTime] = useState(true);

  useEffect(() => {
    /*** if diff of current and next timetoken is less than 20 second, don't show message time ***/
    const myMessages = messageList.filter(item => item.uuid === message.uuid);
    const currentMessageIndex = myMessages.findIndex(item => item.timetoken === message.timetoken);
    const currentMessageTimeToken = message.timetoken;
    const nextMessageTimeToken = myMessages[currentMessageIndex + 1] ? myMessages[currentMessageIndex + 1].timetoken : null;

    if (!nextMessageTimeToken) {
      setShowTime(true);
    } else {
      setShowTime((+nextMessageTimeToken) - (+currentMessageTimeToken) > 600000000);
    }
  })

  const myMessage = () => {
    return (
      <div className="flex flex-1 align-middle justify-end pt-1">
        <div className="flex flex-col items-end ml-1">
          <Typography className={clsx(classes.text, classes.myText)} variant="body2">
            {message.message}
          </Typography>
          {showTime && <div className={clsx(classes.datetimeText, "text-right text-xs pb-1")}>
            {formatMessageTime((+message.timetoken) / 10000000)}
            {
              messageReceipt && (+message.timetoken <= +messageReceipt.message_read) ? (
                <DoneAllIcon className={classes.receiptIcon} />
              ) : (
                (+message.timetoken <= +messageReceipt.message_delivered) ? (
                  <DoneIcon className={classes.receiptIcon} />
                ) : ''
              )
            }
          </div>}
        </div>
      </div>
    )
  }

  const friendMessage = () => {
    return (
      <div className="flex flex-1 items-start justify-start pt-1">
        <CAvatar 
          src={girl?.photos && girl?.photos.length > 0 ? girl?.photos[girl?.photos.length - 1] : ''} 
          alt={message.meta?.name} 
          size="medium" 
        />
        <div className="flex flex-col items-start ml-1">
          <Typography className={clsx(classes.text, classes.friendText)} variant="body2">
            {message.message}
          </Typography>
          {showTime && <div className={clsx(classes.datetimeText, "text-right text-xs pb-1")}>
            {formatMessageTime((+message.timetoken) / 10000000)}
          </div>}
        </div>
      </div>
    )
  }

  return (
    message && message.message && (
      message.uuid === me?.uuid ? myMessage() : friendMessage()
    )
  )
};

export default React.memo(MessageItem);
