import { Button, MenuItem } from "@material-ui/core";
import clsx from "clsx";
import { Select, TextField } from "mui-rff";
import React, { useState } from "react";
import { Form } from "react-final-form";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { parseError } from "../../../../@http-api/helpers";
import CButton from "../../../../common/components/buttons/CButton";
import { useGlobalStyles } from "../../../../common/material/globalStyles";
import { IGuyModel } from "../../../../models/guy.model";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { meState } from "../../../../recoil/atoms/users.atom";
import UserService from "../../services/user.service";

export const ProfileTapContent = () => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const [me, setMe] = useRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState(false);

  const uploadPhoto = () => {
    history.push('/upload');
  }

  const removePhoto = async () => {
    // remove photos
    if (!me?.uuid || loading) return;
    
    setLoading(true);
    try {
      const resp = await UserService.deletePhotos(me.uuid);
      setMe({
        ...resp.data,
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

  const onSubmit = async (data: IGuyModel) => {
    if (!me?.uuid) return;

    setLoading(true);

    try {
      const resp = await UserService.updateGuy(me.uuid, data);
      setMe({
        ...resp.data,
      })
    } catch(e) {
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
      <div className="flex items-center">
        <img 
          className="rounded-full"
          src={me?.photos && me?.photos?.length > 0 ? me.photos[me.photos.length - 1] : '/assets/images/profile-photo.png'} 
          alt=""
          width="128"
          height="128"
        />
        <div className="flex flex-col justify-center ml-2">
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            onClick={() => uploadPhoto()}
          >
            UPLOAD PHOTO
          </Button>
          <div 
            className="mt-2 cursor-pointer"
            onClick={() => removePhoto()}
          >
            Remove Photo
          </div>
        </div>
      </div>

      <Form 
        onSubmit={onSubmit}
        initialValues={{
          name: me?.name,
          email: me?.email,
          phone: me?.phone,
          area: me?.area
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="my-6">
              <TextField
                name="name"
                label="Name"
                variant="outlined"
              />
            </div>
            <div className="my-6">
              <TextField
                inputProps={{
                  readOnly: Boolean(true)
                }}
                name="email"
                type="email"
                label="Email"
                variant="outlined"
              />
            </div>
            <div className="my-6">
              <TextField
                name="phone"
                label="Mobile Number"
                variant="outlined"
              />
            </div>
            <div className="my-6">
              <Select
                name="area"
                label="Area"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Los Angeles, CA">Los Angeles, CA</MenuItem>
                {/* TODO - add more options in next version */}
              </Select>
            </div>

            <CButton
              className="my-6"
              type="submit"
              text="Save"
              loading={loading}
            />
          </form>
        )}
      />
      <div className="text-xs font-light my-6">
        Your name and photo are visible to other members you contact but not shown publicly.
      </div>
    </div>
  )
}
