import React from "react";
import CButton from "../common/components/buttons/CButton";

const LandingPage = (props: any) => {
  const { history } = props;

  return (
    <div className="h-screen flex flex-col text-white p-8" style={{background: '#222222'}}>
      <div className="text-center font-thin text-md">
        OFFSHORE - SECURE - ENCRYPTED
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <img src="assets/images/privatedate-logo.png" width="180" alt="" />
      </div>
      <div className="flex flex-col justify-center items-center pb-10">
        <CButton
          className="w-full"
          text="LOGIN"
          onClick={() => history.push('/login')}
        />

        {/* <div
          className="m-4 text-lg font-light"
          onClick={() => history.push('/joinwaitinglist')}
        >
          Join Waiting List
        </div> */}
      </div>
    </div>
  )
};

export default LandingPage;
