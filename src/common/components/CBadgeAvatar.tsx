import React from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Badge, Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    medium: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    online: {
      width: "16px",
      height: "16px",
      border: `2px solid ${theme.palette.background.paper}`,
      borderRadius: '50%',
      backgroundColor: '#44b700',
      color: '#44b700',
    },
    offline: {
      width: "0",
      height: "0",
    }
  }),
);

const CBadgeAvatar = (props: any) => {
  const classes = useStyles();

  const getSize = (size: string | null | undefined) => {
    switch (size) {
      case 'small':
        return classes.small;
      case 'medium':
        return classes.medium;
      case 'large':
        return classes.large;
      default:
        return '';
    }
  }

  return (
    <Badge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<div className={!props.status || props.status === 'offline' ? classes.offline : classes.online} />}
    >
      <Avatar
        {...props}
        className={getSize(props.size)}
      />
    </Badge>
  )
};

export default CBadgeAvatar;