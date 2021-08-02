import React from "react";
import { AppBar, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from "@material-ui/core/styles";
import { useRecoilValue } from "recoil/dist";
import { selectedGirlState } from "../../../../recoil/atoms/users.atom";
import CAvatar from "../../../../common/components/CAvatar";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: "none",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MessageHeader = (props: any) => {
  const classes = useStyles();

  const girl = useRecoilValue(selectedGirlState);

  const handleBack = () => {
    props.history.replace('/chat/channels')
  }

  return (
    <AppBar className={classes.appBar} position="fixed" color="default">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={handleBack}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {girl?.name}
        </Typography>
        <CAvatar src={girl?.photos && girl?.photos.length > 0 ? girl.photos[girl.photos.length - 1] : ''} alt={girl?.name} />
      </Toolbar>
    </AppBar>
  )
};

export default MessageHeader;
