import React from "react";
import clsx from "clsx";
import { Button, Container, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useGlobalStyles } from "../../../../common/material/globalStyles";
import { useHistory } from "react-router";

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

const ResetPasswordSuccessPage = (props: any) => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const classes = useStyles();

  return (
    <Container className={clsx(gClasses.mainContainer, classes.root)} maxWidth="lg" component="main">
      <Typography variant="h4" className={clsx(classes.title)}>
        Check your email
      </Typography>
      <div>
        <img src="assets/images/success-checkmark.png" width={250} alt="" />
      </div>
      <Typography variant="h6" className={clsx(classes.subTitle)}>
        We have sent a reset password link to your registered email address
      </Typography>

      <div className="mt-8">
        <Button variant="outlined" color="primary" onClick={() => history.push('/')}>HOME</Button>
      </div>
    </Container>
  )
};

export default ResetPasswordSuccessPage;
