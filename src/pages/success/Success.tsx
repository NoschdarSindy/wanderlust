import React, { useEffect, useState } from "react";
import { getDesignMode, getSite } from "src/lib/composables";
import Navbar from "src/components/navbar/Navbar";
import Footer from "src/components/footer/Footer";
import { CheckCircle, Plane, Home, Car } from "lucide-react";
import { domains } from "src/lib/studyData";
import LoadingOverlay from "src/components/LoadingOverlay";
import { sendEvent } from "src/lib/client";

export default function Success() {
  const s = getSite();
  const d = getDesignMode();

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShowOverlay(true);
    }, 3000);

    const redirectTimeout = setTimeout(() => {
      sendEvent("app/end");
      window.close();
      console.log("Redirecting to the homepage...");
    }, 6000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(redirectTimeout);
    };
  }, []);

  const illustration = s.isHotels ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "200px",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Home
        style={{
          height: "100px",
          width: "100px",
          color: "var(--color-background)",
        }}
      />
      <CheckCircle
        style={{
          height: "40px",
          width: "40px",
          color: "var(--color-background)",
          position: "absolute",
          bottom: "10px",
          left: "calc(50% - 60px)",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  ) : s.isFlights ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "200px",
        alignItems: "center",
      }}
    >
      <Plane
        fill="color-mix(in hsl, var(--color-background), var(--color-primary) 30%)"
        strokeWidth="1"
        style={{
          height: "120px",
          width: "120px",
          color: "white",
        }}
      />
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        height: "200px",
        alignItems: "center",
      }}
    >
      <CheckCircle
        style={{
          height: "100px",
          width: "100px",
          color: "var(--color-background)",
        }}
      />
      <Car
        style={{
          height: "100px",
          width: "100px",
          color: "var(--color-background)",
        }}
      />
    </div>
  );

  const title = d.isNone
    ? "Thank you"
    : s.isFlights
      ? "Your flight is booked!"
      : s.isHotels
        ? "Enjoy your stay!"
        : "Your ride is booked!";

  return (
    <>
      {showOverlay && <LoadingOverlay />}
      <Navbar />
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          border: "1px solid lightgray",
          maxWidth: "1024px",
          margin: "1rem auto",
          padding: "2rem",
          position: "relative",
        }}
      >
        <div
          style={{
            display: s.isCars ? "flex" : "block",
            flexDirection: s.isCars ? "row" : "column",
            alignItems: s.isCars ? "center" : "unset",
            justifyContent: s.isCars ? "center" : "unset",
            padding: "4rem 1rem",
            paddingTop: !s.isCars ? "1rem" : "4rem",
            gap: s.isCars ? "2rem" : "0",
            flexWrap: "wrap",
            textAlign: s.isCars ? "left" : "center",
          }}
        >
          <div
            style={{
              flex: s.isCars ? "0 0 auto" : "unset",
            }}
          >
            {illustration}
          </div>
          <div
            style={{
              maxWidth: s.isCars ? "600px" : "500px",
              margin: s.isCars ? "0" : "0 auto",
            }}
          >
            <h1
              style={{
                marginBottom: s.isHotels ? "1rem" : "0.5rem",
                fontSize: s.isHotels
                  ? "2.2rem"
                  : s.isFlights
                    ? "1.8rem"
                    : "2rem",
              }}
            >
              {title}
            </h1>

            <div style={{ fontSize: "1.1rem" }}>
              <>
                <span>
                  {s.isFlights && "Thank you for booking with us. "}
                  {s.isHotels && "Thank you for choosing us. "}
                  {s.isCars && "Thank you for booking your rental. "}

                  {d.isNone
                    ? "Your request has been received, and we’re currently processing it. You’ll receive a confirmation email within 24 hours."
                    : s.isHotels
                      ? "A confirmation of your reservation will be sent to your inbox."
                      : s.isFlights
                        ? "Your e-ticket and flight details will be sent to your email."
                        : "Pickup instructions and rental details are on the way."}
                </span>
                <br />
                <div
                  style={{
                    display: "block",
                    marginTop: "0.5rem",
                    textAlign: s.isFlights ? "center" : "left",
                  }}
                >
                  {s.isFlights && (
                    <>
                      Confirmation Number:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        FLQ-29X7P4
                      </span>
                    </>
                  )}
                  {s.isHotels && (
                    <>
                      Reservation ID: <b>#HRES4839201</b>
                    </>
                  )}
                  {s.isCars && (
                    <>
                      Rental Reference:{" "}
                      <span style={{ fontFamily: "monospace" }}>CB-927401</span>
                    </>
                  )}
                </div>
              </>
            </div>

            {s.isCars && (
              <hr
                style={{
                  margin: "1.5rem 0",
                  borderTop: "1px solid #ddd",
                }}
              />
            )}

            {s.isFlights && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <button
                  style={{
                    padding: "0.4rem 0.8rem",
                    border: "none",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Print confirmation
                </button>
              </div>
            )}

            {!s.isFlights && (
              <p
                style={{ fontSize: "0.9rem", color: "gray", marginTop: "1rem" }}
              >
                Need help? Contact us at{" "}
                <a href="#" onClick={() => false}>
                  support@{domains[s.name]}
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
