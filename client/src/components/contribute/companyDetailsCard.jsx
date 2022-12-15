import React, { useMemo, useState } from "react";
import classes from "../../views/styles/contribute.module.css";

const CompanyDetailsCard = ({ hover, setVideoFocused, name, info, className }) => {
  const Frame = useMemo(
    () => (
      <iframe
        width="100%"
        height="100%"
        src={info.frame || "https://www.youtube.com/embed/4KL_Gzy3NvM"}
        title="YouTube video player"
        onPlay={() => setVideoFocused(true)}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    ),
    [],
  );

  return (
    <>
      {hover === name ? (
        <div className={classes.frame}>{Frame}</div>
      ) : (
        <div className={className || classes.alternateIframe}>
          <div className={classes.companyDetails}>
            <img src={info.logo || "/assets/kidney-fund.png"} className={classes.companyLogo} />
            <div>
              <p className={classes.sinceYearWarper}>
                Since Year: <span className={classes.BoldOne}>{info.foundedIn || "1971"}</span>
              </p>
              <h6 className={classes.revenueFig}>US{info.revenue || "29.31M"}</h6>
              <p className={classes.revenueHead}>Total Revenue</p>
            </div>
          </div>
          <p className={classes.companyLocation}>
            Operating In: <span className={classes.BoldOne}>{info.country}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default CompanyDetailsCard;
