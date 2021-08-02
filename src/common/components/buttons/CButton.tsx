import React from "react";
import clsx from "clsx";
import PuffLoader from 'react-spinners/PuffLoader';
import { Button } from "@material-ui/core";

const CButton = (props: any) => {
  const { className, type = 'button', text = '', loading = false, onClick } = props

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      className={clsx("flex justify-center items-center", className)}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <PuffLoader size={32} color="#ffffff" /> : text}
    </Button>
  )
};

export default CButton;
