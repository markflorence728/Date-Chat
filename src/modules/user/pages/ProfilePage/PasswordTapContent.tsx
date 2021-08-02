import { Container } from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { parseError } from "../../../../@http-api/helpers";
import CButton from "../../../../common/components/buttons/CButton";
import { useGlobalStyles } from "../../../../common/material/globalStyles";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { meState } from "../../../../recoil/atoms/users.atom";
import AuthService from "../../../auth/services/auth.service";

export const PasswordTapContent = () => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const [me, setMe] = useRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    try {
      const data = {
        email: me?.email || ''
      }
      const resp = await AuthService.resetPassword(data);

      setNotification({
        open: true,
        severity: AlertSeverity.SUCCESS,
        message: resp.data as string
      });
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
    <div className={clsx(gClasses.mainContainer, gClasses.footContainer)}>
      <CButton
        className=""
        type="submit"
        text="CHANGE PASSWORD"
        onClick={onSubmit}
        loading={loading}
      />

      <div className="text-xs font-light my-6">
        If you want to change password, please tap on above button. We will send you an email to change your password.
      </div>
    </div>
  )
}
