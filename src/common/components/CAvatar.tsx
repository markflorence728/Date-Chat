import React from 'react';
import Avatar from "@material-ui/core/Avatar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
  }),
);

const CAvatar = (props: any) => {
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
    <Avatar
      {...props}
      className={getSize(props.size)}
    />
  )
};

export default CAvatar;