import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { useSetRecoilState } from 'recoil';
import { useFormStyles } from '../../../../common/material/globalStyles';
import { meState } from '../../../../recoil/atoms/users.atom';
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import clsx from "clsx";
import CButton from "../../../../common/components/buttons/CButton";
import { TextField } from "mui-rff";
import AuthService, { ILoginReqData } from "../../services/auth.service";
import { parseError } from "../../../../@http-api/helpers";
import { useHistory } from 'react-router';

const LoginPage = (props: any) => {
  const history= useHistory();
  const formClasses = useFormStyles();
  const setMe = useSetRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ILoginReqData) => {
    setLoading(true);

    try {
      const resp = await AuthService.login(data);
      setMe({
        ...resp.data.user,
        authorized: true,
      })
      history.push('/dashboard');
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
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <img src="assets/images/privatedate-logo.png" width="180" alt="" />
      </div>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="my-6">
              <TextField
                className={clsx(formClasses.darkThemeInput)}
                name="username"
                type="email"
                label="Email"
                variant="outlined"
                required={true}
              />
            </div>
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

            <div className="flex justify-center">
              <CButton
                className="my-6"
                type="submit"
                text="LOGIN"
                loading={loading}
              />
            </div>

            <div className="flex justify-center my-8">
              <p 
                className="text-base font-light text-gray-500 cursor-pointer"
                onClick={() => history.push('/forgotpassword')}
              >Forgot Password?</p>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default LoginPage;
