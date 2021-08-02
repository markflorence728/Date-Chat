import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Avatar from '@material-ui/core/Avatar';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { meState } from "../../../recoil/atoms/users.atom";

const AccountMenu = (props: any) => {
  const [me, setMe] = useRecoilState(meState)
  const [open, setOpen] = React.useState(false);
  const anchorRef: React.MutableRefObject<any> = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement | Document>) => {
    if (anchorRef && anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement | Document>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const logout = () => {
    setMe(null);
    localStorage.removeItem('privatedate.id_token');
    props.history.push('/landing');
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Avatar
        alt={me?.name}
        src={me?.photos && me?.photos.length > 0 ? me?.photos[0] : '/assets/images/profile-photo.png'}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      />

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {/*<MenuItem*/}
                  {/*  onClick={e => {*/}
                  {/*    handleClose(e);*/}
                  {/*    props.history.push('/chat/channels');*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  Message*/}
                  {/*</MenuItem>*/}
                  <MenuItem
                    onClick={e => {
                      handleClose(e);
                      props.history.push('/profile');
                    }}
                  >
                    My Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={e => {
                      handleClose(e);
                      logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default AccountMenu;
