import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const PageLoader = () => {
  return (
    <div className="flex justify-center align-middle pt-12">
      <ClipLoader size={32} color="#ff4b4b" loading />
    </div>
  );
};

export default PageLoader;
