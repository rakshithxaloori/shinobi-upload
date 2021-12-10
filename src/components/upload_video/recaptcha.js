import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaComp = ({ recaptchaRef }) => (
  <ReCAPTCHA
    ref={recaptchaRef}
    size="invisible"
    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
  />
);

export default RecaptchaComp;
