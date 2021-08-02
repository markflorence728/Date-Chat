import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AccountMenu from './menus/AccountMenu';
import { meState } from '../../recoil/atoms/users.atom';
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {},
  toolbar: {
    flexGrow: 1
  },
  toolbarTitle: {
    flexGrow: 1,
    color: '#007000',
    fontWeight: 'bold'
  }
}));

const Header = (props: any) => {
  const classes = useStyles();
  const me = useRecoilValue(meState);

  const goRoot = () => {
    props.history.push('/')
  }

  return (
    me?.authorized ? (
      <AppBar className={classes.appBar} position="fixed" color="inherit">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" className={classes.toolbarTitle} onClick={goRoot}>
            Private Date
          </Typography>

          <AccountMenu {...props} />
        </Toolbar>
      </AppBar>
    ) : (
      <></>
    )
  );
};

export default Header;
