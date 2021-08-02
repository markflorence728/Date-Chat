import React from "react";
import { Chip, Typography } from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil/dist";
import { meState, selectedGirlState, girlListState } from "../../../../recoil/atoms/users.atom";
import { formatMessageTime } from "../../helper";
import { useHistory } from "react-router";
import { Skeleton } from "@material-ui/lab";
import CBadgeAvatar from "../../../../common/components/CBadgeAvatar";
import UserService from "../../../user/services/user.service";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { parseError } from "../../../../@http-api/helpers";

export const LoadingChannelItem = (props: any) => {
  return (
    <div className="flex items-center my-1 cursor-pointer">
      <div className="p-1">
        <Skeleton animation="wave" variant="circle" width={40} height={40} />
      </div>
      <div className="flex-1 flex flex-col justify-center p-1">
        <div className="flex items-center">
          <Skeleton animation="wave" height={10} width="40%" />
        </div>
        <div className="flex items-center">
          <Skeleton animation="wave" height={10} width="100%" />
        </div>
      </div>
    </div>
  )
}

const ChannelItem = (props: any) => {
  const { chat } = props;
  const history = useHistory();
  const [me, setMe] = useRecoilState(meState);
  const girls = useRecoilValue(girlListState);
  const setSelectedGirl = useSetRecoilState(selectedGirlState);
  const setNotification = useSetRecoilState(notificationState);

  const unreadMessageBadge = (unreadMessageCount: number) => {
    if (unreadMessageCount === 9999) {
      return <Chip color="primary" size="small" label="100+" />
    } else if (unreadMessageCount > 0) {
      return <Chip color="primary" size="small" label={unreadMessageCount} />
    } else {
      return;
    }
  }

  const handleClick = async () => {
    const selectedGirlUuid = chat.girl.uuid;
    let selectedGirl;
    selectedGirl = girls.find(girl => girl.uuid === selectedGirlUuid);
    if(!selectedGirl) {
      try {
        const resp = await UserService.getGirl(selectedGirlUuid);
        selectedGirl = resp.data;
      } catch(e) {
        const { errorMessage, errorStatus } = parseError(e);

        setNotification({
          open: true,
          severity: AlertSeverity.ERROR,
          message: errorMessage
        });

        if (errorStatus === 401) {
          setMe(null);
          props.history.push('/login');
        }
      }
    }

    if (selectedGirl?.uuid) {
      setSelectedGirl(selectedGirl);
    }

    history.push(`/chat/messages`);
  }

  return (
    true && (
      <div className="flex items-center my-1 cursor-pointer" onClick={handleClick}>
        <div className="p-1">
          <CBadgeAvatar src={chat.girl.photo_url} alt={chat.girl.name} status={chat.girl.status} />
        </div>
        <div className="flex-1 flex flex-col justify-center p-1 ml-2">
          <div className="flex items-center">
            <div className="text-lg font-normal nowrap flex-1">{chat.girl.name}</div>
            <div>
              {unreadMessageBadge(chat.unreadMessageCount)}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xs nowrap flex-1 pr-2">
              {(chat.lastMessage?.uuid === me?.uuid ? 'Me: ' : '') + (chat.lastMessage?.message || '')}
            </div>
            <div className="text-xs nowrap">
              {formatMessageTime((+chat.lastMessage?.timetoken || 0) / 10000000)}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default React.memo(ChannelItem);
