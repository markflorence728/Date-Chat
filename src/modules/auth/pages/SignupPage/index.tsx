import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFormStyles, useGlobalStyles } from "../../../../common/material/globalStyles";
import { Container, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TextField } from "mui-rff";
import CButton from "../../../../common/components/buttons/CButton";
import { Form } from "react-final-form";
import AuthService, { ISignupReqData } from "../../services/auth.service";
import { useSetRecoilState } from "recoil/dist";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { parseError } from "../../../../@http-api/helpers";
import { meState } from "../../../../recoil/atoms/users.atom";
import { useHistory } from "react-router";

interface ISignupFormData extends ISignupReqData {
  confirm_password: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: theme.spacing(4),
  }
}))

const SignupPage = (props: any) => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const formClasses = useFormStyles();
  const classes = useStyles();
  const setNotification = useSetRecoilState(notificationState);
  const setMe = useSetRecoilState(meState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ISignupFormData) => {
    const { email, password, confirm_password } = data;

    if (password != confirm_password) {
      setNotification({
        open: true,
        severity: AlertSeverity.WARNING,
        message: "Please confirm your password again."
      });

      return;
    }

    setLoading(true);

    try {
      const resp = await AuthService.signup({ email, password });
      history.push("/login");
    } catch (e) {
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

    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <img src="assets/images/privatedate-logo.png" width="180" alt="" />
      </div>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" color="primary" className="text-center" style={{ color: "#ffffff", fontWeight: 500 }}>
              Private Invitation
            </Typography>

            <div className="my-6">
              <TextField
                className={clsx(formClasses.darkThemeInput)}
                name="email"
                type="email"
                label="Email"
                variant="outlined"
                required={true}
              />
            </div>

            <Typography variant="h5" color="primary" className="text-center" style={{ color: "#ffffff", fontWeight: 300 }}>
              Set a password
            </Typography>
            <div className="my-6">
              <TextField
                className={clsx(formClasses.darkThemeInput)}
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                required={true}
              />
            </div>
            <div className="my-6">
              <TextField
                className={clsx(formClasses.darkThemeInput)}
                name="confirm_password"
                type="password"
                label="Confirm Password"
                variant="outlined"
                required={true}
              />
            </div>

            <div className="flex justity-center">
              <CButton
                className="w-full my-6"
                type="submit"
                text="SIGN UP"
                loading={loading}
              />
            </div>
          </form>
        )}
      />
    </div>
  )
};

export default SignupPage;
