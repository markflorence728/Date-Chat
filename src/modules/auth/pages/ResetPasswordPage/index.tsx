import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFormStyles, useGlobalStyles } from "../../../../common/material/globalStyles";
import { Container } from "@material-ui/core";
import clsx from "clsx";
import { useHistory } from "react-router";
import { Form } from "react-final-form";
import { TextField } from "mui-rff";
import CButton from "../../../../common/components/buttons/CButton";
import AuthService from "../../services/auth.service";
import { parseError } from "../../../../@http-api/helpers";
import { useSetRecoilState } from "recoil";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { meState } from "../../../../recoil/atoms/users.atom";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: "column",
    padding: theme.spacing(4),
  }
}))

const ResetPasswordPage = (props: any) => {
  const history = useHistory();

  const gClasses = useGlobalStyles();
  const formClasses = useFormStyles();
  const classes = useStyles();
  const setMe = useSetRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);

    try {
      const resp = await AuthService.resetPassword(data);
      history.push('/resetpasswordsuccess');
    } catch (e) {
      const { errorMessage, errorStatus } = parseError(e);

      setNotification({
        open: true,
        severity: AlertSeverity.ERROR,
        message: errorMessage
      });

      if (errorStatus === 401) {
        setMe(null);
        history.push('/login');
      }
    }

    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white p-8">
      <div className="flex items-center">
        <img src="assets/images/return-arrow.png" alt="" style={{ height: '36px' }} onClick={() => history.push('/login')} />
        <p className="ml-4 text-white font-light text-2xl">Forgot Password</p>
      </div>

      <div className="">
        <p className="mt-16 text-center text-sm font-light text-gray-600">Enter your email address to reset your password.</p>
      </div>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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

            <div className="flex justify-center">
              <CButton
                className="my-6"
                type="submit"
                text="RESET PASSWORD"
                loading={loading}
              />
            </div>

          </form>
        )}
      />
    </div>
  )
};

export default ResetPasswordPage;
