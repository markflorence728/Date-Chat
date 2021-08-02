import { IconButton } from '@material-ui/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { meState } from '../../../../recoil/atoms/users.atom';
import CAvatar from '../../../../common/components/CAvatar';

export const ProfileHeader = () => {
  const me = useRecoilValue(meState);

  return (
    <div className="flex justify-center p-2 shadow">
      <div className="flex-1 flex items-center">
        <CAvatar
          size="mediumn"
          src={me?.photos && me?.photos?.length > 0 ? me.photos[me.photos.length - 1] : ''}
          alt="user photo"
        />
        <div className="flex flex-col justify-center ml-2">
          <div className="text-lg font-bold">{me?.name}</div>
          {/* <div className="text-xs truncate">{me?.uuid}</div> */}
        </div>
      </div>
      <div>
        {/* <IconButton aria-label="menu">
          <MoreVertIcon />
        </IconButton> */}

        {/* TODO - add menu in next version. no need for MVP */}
      </div>
    </div>
  );
};
