import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        zIndex: 9999, 
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* <p>בטעינה</p> */}
        <DotLottieReact
          src="https://lottie.host/c083d9fe-7735-4f1e-87d3-739bd5fd4e9d/ahjoWwfi80.lottie"
          loop
          autoplay
          style={{ width: "200px", height: "100px" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
