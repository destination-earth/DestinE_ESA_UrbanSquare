"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const headerStyles = {
  headerContainer: {
    width: "100vw",
    maxWidth: "100vw",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    // justifyContent: "center",
    height: "64px",
    maxHeight: "64px",
    margin: 0,
    padding: 0,
    backgroundColor: "#0D1527FF",
    color: "#FFFFFF",
    fontFamily: "Roboto-Bold, sans-serif",
    fontSize: "16px",
    zIndex: 99,
  } as React.CSSProperties,
  headerInnerContainer: {
    // maxWidth: "1600px",
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
    margin: "0 20px",
    padding: 0,
  } as React.CSSProperties,
  leftContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    gap: "20px",
  } as React.CSSProperties,
  urbanSquareContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  centralContainer: {
    height: "100%",
    // maxWidth: "800px",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-end",
    flexGrow: 1,
    margin: 0,
    padding: "0 40px",
  } as React.CSSProperties,
  rightContainer: {
    display: "flex",
    height: "100%",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "right",
    gap: "20px",
  } as React.CSSProperties,
  headerLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    transition: "color 250ms ease-in-out",
  } as React.CSSProperties,
  headerLinkHover: {
    color: "#7A7A7A",
  } as React.CSSProperties,
  currentLink: {
    color: "#EF2B89",
  } as React.CSSProperties,
  infoContainer: {
    position: "relative",
    marginRight: "40px",
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  infoButton: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
  } as React.CSSProperties,
  infoIcon: {
    width: "24px",
    height: "24px",
    transition: "color 250ms ease-in-out",
    color: "#FFFFFF",
  } as React.CSSProperties,
  infoFrame: {
    position: "absolute" as const,
    display: "none",
    opacity: 0,
    top: "64px",
    flexDirection: "column" as const,
    padding: 0,
    margin: 0,
    backgroundColor: "#0D1527BB",
    gap: "0px",
    fontSize: "16px",
    width: "160px",
    left: "-20px",
    zIndex: 9999, // High z-index to appear above map and other elements
  } as React.CSSProperties,
  userFrame: {
    position: "absolute" as const,
    display: "none",
    opacity: 0,
    top: "64px",
    flexDirection: "column" as const,
    padding: 0,
    margin: 0,
    backgroundColor: "#0D1527BB",
    gap: "0px",
    fontSize: "16px",
    width: "200px",
    left: "0px",
    zIndex: 9999, // High z-index to appear above map and other elements
  } as React.CSSProperties,
  frameLink: {
    textDecoration: "none",
    padding: "16px",
    transition: "color 250ms ease-in-out",
    cursor: "pointer",
    color: "#B7B7B7",
  } as React.CSSProperties,
  frameLinkHover: {
    backgroundColor: "#1E2637",
    color: "#7A7A7A",
  } as React.CSSProperties,
  // Modal styles
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it appears above everything else
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto" as const,
    color: "black",
  } as React.CSSProperties,
  modalButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#0D1527",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  } as React.CSSProperties,
  logo: {
    cursor: "pointer",
  } as React.CSSProperties,
  // Media query styles will be handled with React's useEffect and window.matchMedia
};

// Add keyframes for the gradient animation
const keyframes = `
@keyframes mix-to-violet {
  0% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
@keyframes violet-to-mix {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 50% 50%;
  }
}
`;

const Header = () => {
  const basePath = process.env.BASEPATH || "";

  // State variables
  const [headerInfoMenuIsVisible, setHeaderInfoMenuIsVisible] = useState(false);
  const [headerUserMenuIsVisible, setHeaderUserMenuIsVisible] = useState(false);
  const [headerHasRevealed, setHeaderHasRevealed] = useState(false);
  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // For the IPCC modal

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const infoFrameRef = useRef<HTMLDivElement>(null);
  const userFrameRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // For tracking scroll position
  const scrollPositionPrecRef = useRef(0);
  const tempPrevPosRef = useRef(0);
  const hidingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const backgroundColor = "#0D1527FF";
  const backgroundColorTransparent = "#0D1527BB";
  const headerHeight = "64px";
  const hideTimeout = 2000;

  // Modal functions
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Insert keyframes into document
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = keyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Function to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const deltaY = window.scrollY - tempPrevPosRef.current;

      setTimeout(() => {
        if (window.scrollY < 200 && headerRef.current) {
          headerRef.current.style.backgroundColor = backgroundColor;
        }
      }, 500);

      if (deltaY > 0 && deltaY < 100) {
        setTimeout(() => {
          scrollPositionPrecRef.current = window.scrollY;
        }, 500);

        if (headerHasRevealed && headerRef.current) {
          if (hidingTimeoutIdRef.current) {
            clearTimeout(hidingTimeoutIdRef.current);
          }

          setHeaderHasRevealed(false);
          headerRef.current.style.transition =
            "top 500ms ease-in-out, background-color 500ms ease-in-out";
          headerRef.current.style.top = `-${headerHeight}`;

          setTimeout(() => {
            if (headerRef.current) {
              headerRef.current.style.position = "static";
              headerRef.current.style.backgroundColor = backgroundColor;
              hideHeaderInfoMenu();
              hideHeaderUserMenu();
            }
          }, 500);
        }
      } else if (deltaY < 0 && deltaY > -100) {
        if (window.scrollY >= 200 && headerRef.current) {
          headerRef.current.style.backgroundColor = backgroundColorTransparent;
          headerRef.current.style.transition =
            "top 250ms ease-in-out, background-color 500ms ease-in-out";
          headerRef.current.style.top = "0px";
          headerRef.current.style.position = "sticky";

          setTimeout(() => {
            setHeaderHasRevealed(true);
          }, 500);

          if (hidingTimeoutIdRef.current) {
            clearTimeout(hidingTimeoutIdRef.current);
          }

          hidingTimeoutIdRef.current = setTimeout(() => {
            if (headerRef.current) {
              headerRef.current.style.transition =
                "top 500ms ease-in-out, background-color 500ms ease-in-out";
              headerRef.current.style.top = `-${headerHeight}`;
            }
          }, hideTimeout);
        }
      }

      tempPrevPosRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hidingTimeoutIdRef.current) {
        clearTimeout(hidingTimeoutIdRef.current);
      }
    };
  }, [headerHasRevealed]);

  // Mouse over/leave handlers for header
  useEffect(() => {
    if (!headerRef.current) return;

    const handleMouseOver = () => {
      if (hidingTimeoutIdRef.current) {
        clearTimeout(hidingTimeoutIdRef.current);
      }
    };

    const handleMouseLeave = () => {
      hidingTimeoutIdRef.current = setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.transition =
            "top 500ms ease-in-out, background-color 500ms ease-in-out";
          headerRef.current.style.top = `-${headerHeight}`;
        }
      }, hideTimeout);
    };

    headerRef.current.addEventListener("mouseover", handleMouseOver);
    headerRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (headerRef.current) {
        headerRef.current.removeEventListener("mouseover", handleMouseOver);
        headerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Function to show/hide header info menu
  const showHeaderInfoMenu = () => {
    if (infoFrameRef.current) {
      infoFrameRef.current.style.display = "flex";
      infoFrameRef.current.style.opacity = "1.0";
      setHeaderInfoMenuIsVisible(true);
    }
  };

  const hideHeaderInfoMenu = () => {
    if (infoFrameRef.current) {
      infoFrameRef.current.style.display = "none";
      infoFrameRef.current.style.opacity = "0.0";
      setHeaderInfoMenuIsVisible(false);
    }
  };

  // Function to show/hide header user menu
  const showHeaderUserMenu = () => {
    if (userFrameRef.current) {
      userFrameRef.current.style.display = "flex";
      userFrameRef.current.style.opacity = "1.0";
      setHeaderUserMenuIsVisible(true);
    }
  };

  const hideHeaderUserMenu = () => {
    if (userFrameRef.current) {
      userFrameRef.current.style.display = "none";
      userFrameRef.current.style.opacity = "0.0";
      setHeaderUserMenuIsVisible(false);
    }
  };

  // Toggle info menu
  const toggleInfoMenu = () => {
    if (headerInfoMenuIsVisible) {
      hideHeaderInfoMenu();
    } else {
      showHeaderInfoMenu();
      hideHeaderUserMenu();
    }
  };

  return (
    <>
      {/* Header */}
      <div
        id="desp-header-container"
        ref={headerRef}
        style={headerStyles.headerContainer}
      >
        <div
          id="desp-header-inner-container"
          style={headerStyles.headerInnerContainer}
        >
          {/* Left container */}
          <div id="left-container" style={headerStyles.leftContainer}>
            <Link href="https://destination-earth.eu">
              <Image
                id="eu-flag-de"
                alt="destine platform home"
                src={`${basePath}/destination_earth_logo.svg`}
                width={160}
                height={36}
              />
            </Link>
            {/* Urban Square Logo */}
            <div style={headerStyles.urbanSquareContainer}>
              <Image
                id="urban-square-logo"
                alt="urban-square-page"
                src={`${basePath}/UrbanS_Logo.png`}
                width={190}
                height={35}
                style={{
                  objectFit: "contain",
                  marginTop: "8px",
                }}
              />
            </div>
            {/* Sistema Logo */}
            <Link href="https://www.sistema.at/">
              <Image
                id="service-logo"
                alt="service-home"
                src={`${basePath}/sistemaLogo.png`}
                width={100}
                height={50}
              />
            </Link>
          </div>

          {/* Central container */}
          <div id="central-container" style={headerStyles.centralContainer}>
            <Link
              href="https://destinationearth.murmureo.com/urban-square/"
              className="header-link"
            >
              Home
            </Link>
          </div>

          {/* Right container */}
          <div id="right-container" style={headerStyles.rightContainer}>
            {/* Info Button */}
            <div id="info-container" style={headerStyles.infoContainer}>
              <div
                id="info-button"
                style={headerStyles.infoButton}
                onClick={toggleInfoMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={headerStyles.infoIcon}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>

              {/* Info Menu */}
              <div
                id="info-frame"
                ref={infoFrameRef}
                style={headerStyles.infoFrame}
              >
                <Link
                  className="frame-link"
                  href="https://platform.destine.eu/services/documents-and-api/doc/?service_name=urbansquare"
                  style={headerStyles.frameLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </Link>
                <Link
                  className="frame-link"
                  href="https://platform.destine.eu/support/"
                  style={headerStyles.frameLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Support
                </Link>
              </div>
            </div>
            <Image
              id="ipcc-logo"
              alt="IPCC Logo"
              src={`${basePath}/ipcc.png`}
              width={35}
              height={36}
              style={headerStyles.logo}
              onClick={openModal}
            />
          </div>
        </div>
      </div>

      {/* Modal for IPCC Logo */}
      {isModalOpen && (
        <div style={headerStyles.modalOverlay} onClick={closeModal}>
          <div
            style={headerStyles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2>
              <b>Acknowledgments</b>
            </h2>
            <p className="text-sm">
              We thank the projection authors for developing and making the
              sea-level rise projections available, multiple funding agencies
              for supporting the development of the projections, and the NASA
              Sea Level Change Team for developing and hosting the IPCC AR6 Sea
              Level Projection Tool.
            </p>
            <ul>
              <li>
                <p className="text-xs mt-4">
                  Fox-Kemper, B., H.T. Hewitt, C. Xiao, G. Aðalgeirsdóttir, S.S.
                  Drijfhout, T.L. Edwards, N.R. Golledge, M. Hemer, R.E. Kopp,
                  G. Krinner, A. Mix, D. Notz, S. Nowicki, I.S. Nurhati, L.
                  Ruiz, J.-B. Sallée, A.B.A. Slangen, and Y. Yu, 2021: Ocean,
                  Cryosphere and Sea Level Change. In{" "}
                  <i>Climate Change 2021: The Physical Science Basis</i>.
                  Contribution of Working Group I to the Sixth Assessment Report
                  of the Intergovernmental Panel on Climate Change.{" "}
                  <a
                    href="https://doi.org/10.1017/9781009157896.011"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0000EE", textDecoration: "underline" }}
                  >
                    doi:10.1017/9781009157896.011
                  </a>
                </p>
              </li>
              <p className="text-xs mt-2">
                Kopp, R. E., Garner, G. G., Hermans, T. H. J., Jha, S., Kumar,
                P., Reedy, A., Slangen, A. B. A., Turilli, M., Edwards, T. L.,
                Gregory, J. M., Koubbe, G., Levermann, A., Merzky, A., Nowicki,
                S., Palmer, M. D., & Smith, C. (2023). The Framework for
                Assessing Changes To Sea-Level (FACTS) v1.0: A platform for
                characterizing parametric and structural uncertainty in future
                global, relative, and extreme sea-level change.{" "}
                <i>Geoscientific Model Development</i>, 16, 7461–7489.{" "}
                <a
                  href="https://doi.org/10.5194/gmd-16-7461-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0000EE", textDecoration: "underline" }}
                >
                  https://doi.org/10.5194/gmd-16-7461-2023
                </a>
              </p>
              <p className="text-xs mt-2">
                Garner, G. G., T. Hermans, R. E. Kopp, A. B. A. Slangen, T. L.
                Edwards, A. Levermann, S. Nowicki, M. D. Palmer, C. Smith, B.
                Fox-Kemper, H. T. Hewitt, C. Xiao, G. Aðalgeirsdóttir, S. S.
                Drijfhout, T. L. Edwards, N. R. Golledge, M. Hemer, G. Krinner,
                A. Mix, D. Notz, S. Nowicki, I. S. Nurhati, L. Ruiz, J-B.
                Sallée, Y. Yu, L. Hua, T. Palmer, B. Pearson, 2021.{" "}
                <i>IPCC AR6 Sea Level Projections</i>. Version 20210809. Dataset
                accessed at{" "}
                <a
                  href="https://doi.org/10.5281/zenodo.5914709"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0000EE", textDecoration: "underline" }}
                >
                  https://doi.org/10.5281/zenodo.5914709
                </a>
              </p>
            </ul>
            <button onClick={closeModal} style={headerStyles.modalButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Container Reference - This is just a reference to an element that should exist in your app */}
      <div
        id="main-container"
        ref={mainContainerRef}
        style={{ display: "block" }}
      >
        {/* This is where your main content will go */}
      </div>
    </>
  );
};

export default Header;
