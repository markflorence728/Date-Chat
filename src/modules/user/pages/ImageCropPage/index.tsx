/************
 * Image Crop Component
 * Refer url: https://www.npmjs.com/package/react-image-crop, https://codesandbox.io/s/72py4jlll6, 
**/

import { Container } from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { parseError } from "../../../../@http-api/helpers";
import CButton from "../../../../common/components/buttons/CButton";
import { useGlobalStyles } from "../../../../common/material/globalStyles";
import { AlertSeverity, notificationState } from "../../../../recoil/atoms/notification.atom";
import { meState } from "../../../../recoil/atoms/users.atom";
import { getResizedCanvas, pixelRatio } from "../../helper";
import UserService from "../../services/user.service";

const ImageCropPage = (props: any) => {
  const history = useHistory();
  const gClasses = useGlobalStyles();
  const [me, setMe] = useRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState(false);

  const [upImg, setUpImg] = useState<string>('');
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const generateUpload = async (previewCanvas: CanvasImageSource | null, crop: Crop | null) => {
    if (!crop || !crop.width || !crop.height || !previewCanvas) {
      return;
    }

    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
    const croppedBase64 = canvas.toDataURL();

    // upload croped image - base64 image
    if (!me?.uuid) return;

    setLoading(true);
    try {
      alert()

      const data = { base64: croppedBase64 };
      const resp = await UserService.uploadPhoto(me.uuid, data);
      setMe({
        ...resp.data,
      });
      history.push('/settings')
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

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = (crop.width || 0) * pixelRatio;
    canvas.height = (crop.height || 0) * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      (crop.x || 0) * scaleX,
      (crop.y || 0) * scaleY,
      (crop.width || 0) * scaleX,
      (crop.height || 0) * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  return (
    <Container className={gClasses.mainContainer} maxWidth="lg" component="main">
      <div className="flex items-center">
        <img src="assets/images/return-arrow.png" alt="" style={{ height: '36px' }} onClick={() => history.push('/settings')} />
        <p className="ml-4 text-2xl">Crop & upload</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="my-8">
          <label className="border border-gray-500 px-8 py-2">
            <span className="text-base">Chooose a image file</span>
            <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
          </label>
        </div>

        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />

        <div className="my-4 hidden">
          <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0)
            }}
          />
        </div>

        <div className="my-8">
        {
          (completedCrop && completedCrop?.width && completedCrop?.height) &&
          <CButton
            loading={loading}
            onClick={() => generateUpload(previewCanvasRef.current, completedCrop)}
            text='Upload cropped image'
          />
        }
        </div>
      </div>
    </Container>
  )
}

export default ImageCropPage;
