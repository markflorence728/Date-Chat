import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Container, MenuItem, Typography } from "@material-ui/core";
import { useFormStyles, useGlobalStyles } from "../../../../common/material/globalStyles";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { useSetRecoilState } from "recoil/dist";
import clsx from "clsx";
import { TextField, Select } from "mui-rff";
import CButton from "../../../../common/components/buttons/CButton";
import { Form } from "react-final-form";
import AuthService, { IJoinWaitingListReqData } from "../../services/auth.service";
import { UserGender } from "../../../../models/user.model";
import { parseError } from "../../../../@http-api/helpers";
import { meState } from "../../../../recoil/atoms/users.atom";
import { useHistory } from "react-router";

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

const JoinWaitingListPage = (props: any) => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const formClasses = useFormStyles();
  const classes = useStyles();

  const setNotification = useSetRecoilState(notificationState);
  const setMe = useSetRecoilState(meState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IJoinWaitingListReqData) => {
    setLoading(true);

    try {
      await AuthService.joinWaitingList(data);

      history.push('/joinwaitinglistsuccess')
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
            <Typography variant="h5" color="primary" className="text-center" style={{ color: "#ffffff", fontWeight: 300 }}>
              Waiting List
            </Typography>

            <div className={clsx(formClasses.darkThemeInput, "my-6")}>
              <TextField
                name="email"
                type="email"
                label="Email"
                variant="outlined"
                required={true}
              />
            </div>
            <div className={clsx(formClasses.darkThemeInput, "my-6")}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                required={true}
              />
            </div>
            <div className={clsx(formClasses.darkThemeInput, "my-6")}>
              <Select
                name="gender"
                label="Gender"
                variant="outlined"
                required={true}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={UserGender.MALE}>Male</MenuItem>
                <MenuItem value={UserGender.FEMALE}>Female</MenuItem>
                <MenuItem value={UserGender.OTHER}>Other</MenuItem>
              </Select>
            </div>

            <CButton
              className="w-full my-6"
              type="submit"
              text="JOIN"
              loading={loading}
            />
          </form>
        )}
      />

      <div className="text-center text-lg font-light m-8" style={{ color: '#ffffff' }}>
        Your information is kept private and secure. It is never shared or sold.
      </div>
    </div>
  )
}

export default JoinWaitingListPage;
