import { Crop } from "react-image-crop";
import { ConsoleService } from "../../common/services/console.service";

// Increase pixel density for crop preview quality on retina screens.
export const pixelRatio = window.devicePixelRatio || 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
export function getResizedCanvas(
  canvas: CanvasImageSource, 
  newWidth: number, 
  newHeight: number
): HTMLCanvasElement {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width as number,
    canvas.height as number,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

export function generateDownload(
  previewCanvas: CanvasImageSource | null, 
  crop: Crop | null
) {
  if (!crop || !crop.width || !crop.height || !previewCanvas) {
    ConsoleService.error('Crop', crop);
    ConsoleService.error('CanvasImageSource', previewCanvas);
    return;
  }

  const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      ConsoleService.log(previewUrl)

      const anchor = document.createElement("a");
      anchor.download = "cropPreview.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    "image/png",
    1
  );
}
