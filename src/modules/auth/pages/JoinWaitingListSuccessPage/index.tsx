import React from "react";
import clsx from "clsx";
import { Container, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useGlobalStyles } from "../../../../common/material/globalStyles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  title: {
    color: "#ffffff",
    fontWeight: 500,
    textAlign: "center"
  },
  subTitle: {
    color: "#ffffff",
    fontWeight: 300,
    textAlign: "center"
  }
}))

const JoinWaitingListSuccessPage = (props: any) => {
  const gClasses = useGlobalStyles();
  const classes = useStyles();

  return (
    <Container className={clsx(gClasses.mainContainer, classes.root)} maxWidth="lg" component="main">
      <Typography variant="h4" className={clsx(classes.title)}>
        Added
      </Typography>
      <div>
        <img src="assets/images/success-checkmark.png" width={250} alt="" />
      </div>
      <Typography variant="h6" className={clsx(classes.subTitle)}>
        Your information has been securely added to the waiting list. You will receive on email when new memberships are open
      </Typography>
    </Container>
  )
};

export default JoinWaitingListSuccessPage;
