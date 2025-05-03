import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { domains } from "src/lib/studyData"; // Import Bootstrap CSS

const Config = () => {
  const navigate = useNavigate();
  const entries = JSON.parse(process.env.REACT_APP_ENTRIES);

  useEffect(() => {
    copySettingsUrl();
  }, []);

  const generateSettingsUrl = (domain) =>
    `chrome://settings/content/siteDetails?site=https%3A%2F%2F${domain}`;

  const copySettingsUrl = (domain?: string) => {
    domain ??= Object.values(domains)[0];
    const url = generateSettingsUrl(domain);
    navigator.clipboard
      .writeText(url)
      .then(() => console.log("URL copied to clipboard:", url))
      .catch(() => console.warn("Unable to copy URL to clipboard"));
  };

  const handleBeginStudy = () => {
    navigate("/consent"); // Navigate to the consent page
  };

  const getUrls = () => {
    return Object.values(domains).map((domain) => (
      <p key={domain}>
        {generateSettingsUrl(domain)}{" "}
        <button onClick={() => copySettingsUrl(domain)}>
          Copy to clipboard
        </button>
      </p>
    ));
  };

  return (
    <div className="m-5 p-xl-5">
      <p>Participant: {process.env.REACT_APP_PARTICIPANT}</p>
      <pre>{entries.map(({ site, design }) => `${site}: ${design}\n`)}</pre>
      <p>
        Make sure and site data and permissions are reset before conducting the
        study. To check permissions, open a new tab and paste:
      </p>
      <div>{getUrls()}</div>
      <p>
        <button className="btn btn-primary" onClick={handleBeginStudy}>
          Begin study
        </button>
      </p>
    </div>
  );
};

export default Config;
