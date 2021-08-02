import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface CImageProps {
  alt: string;
  src: string;
  width?: number;
  height?: number;
  caption?: string;
}

const CImage = (props: CImageProps) => {
  const { alt, src, width, height, caption } = props;

  <div>
    <LazyLoadImage
      src={src} // use normal <img> attributes as props
      alt={alt}
      height={height || 'auto'}
      width={width || 'auto'} 
    />
    <span>{caption || ''}</span>
  </div>
}

export default CImage;
