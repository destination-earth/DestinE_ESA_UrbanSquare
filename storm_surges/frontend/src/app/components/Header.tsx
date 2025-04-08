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
    justifyContent: "center",
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
    maxWidth: "1600px",
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
  centralContainer: {
    height: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    margin: 0,
    padding: "0 40px",
  } as React.CSSProperties,
  rightContainer: {
    display: "flex",
    height: "100%",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-end",
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
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  userContainer: {
    position: "relative",
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
  loginDiv: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 40px",
    borderRadius: "18px",
    height: "36px",
    background:
      "linear-gradient(90deg, #EF2B89 0%, #EF2B89 40%, #7B34DB 60%, #7B34DB 100%)",
    backgroundSize: "400% 100%",
    animationName: "violet-to-mix",
    animationDuration: "250ms",
    animationTimingFunction: "ease-in-out",
    animationFillMode: "forwards",
    cursor: "pointer",
    textAlign: "center",
    margin: "0 auto",
  } as React.CSSProperties,
  loginA: {
    display: "flex",
    textDecoration: "none",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  } as React.CSSProperties,
  loginIcon: {
    width: "18px",
    height: "18px",
    color: "#FFFFFF",
    padding: 0,
    margin: 0,
  } as React.CSSProperties,
  loginText: {
    maxWidth: "200px",
    fontSize: "16px",
    color: "#FFFFFF",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  notLogged: {
    display: "none",
  } as React.CSSProperties,
  logged: {
    display: "flex",
  } as React.CSSProperties,
  menuIconContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  menuIcon: {
    width: "40px",
    height: "40px",
    transition: "color 250ms ease-in-out",
    color: "#FFFFFF",
  } as React.CSSProperties,
  dropdownMenuContainer: {
    display: "none",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "100%",
    height: "calc(100dvh - 64px)",
    top: 0,
    padding: 0,
    fontFamily: "Roboto-Bold, sans-serif",
    fontSize: "16px",
    zIndex: 999,
  } as React.CSSProperties,
  dropdownLink: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#0D1527FF",
    borderTop: "solid 1px #000",
    borderBottom: "solid 1px #000",
  } as React.CSSProperties,
  dropdownLinkA: {
    textDecoration: "none",
    color: "#FFFFFF",
    transition: "color 250ms ease-in-out",
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
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(true); // Set this based on your auth logic
  const [isModalOpen, setModalOpen] = useState(false); // For the IPCC modal

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const infoFrameRef = useRef<HTMLDivElement>(null);
  const userFrameRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuContainerRef = useRef<HTMLDivElement>(null);

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

  // Media query handler for dropdown menu
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        hideDropdownMenu();
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Initial check
    if (mediaQuery.matches) {
      hideDropdownMenu();
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
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

  // Function to hide dropdown menu
  const hideDropdownMenu = () => {
    if (dropdownMenuContainerRef.current) {
      dropdownMenuContainerRef.current.style.display = "none";
      setDropdownIsVisible(false);
    }

    if (mainContainerRef.current) {
      mainContainerRef.current.style.display = "block";
    }

    if (footerContainerRef.current) {
      footerContainerRef.current.style.display = "flex";
    }
  };

  // Toggle dropdown menu
  const toggleDropdownMenu = () => {
    if (dropdownIsVisible) {
      hideDropdownMenu();
    } else {
      if (dropdownMenuContainerRef.current) {
        dropdownMenuContainerRef.current.style.display = "flex";
      }

      if (mainContainerRef.current) {
        mainContainerRef.current.style.display = "none";
      }

      if (footerContainerRef.current) {
        footerContainerRef.current.style.display = "none";
      }

      if (headerRef.current) {
        headerRef.current.style.backgroundColor = backgroundColor;
      }

      setDropdownIsVisible(true);
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

  // Toggle user menu
  const toggleUserMenu = () => {
    if (headerUserMenuIsVisible) {
      hideHeaderUserMenu();
    } else {
      if (userIsAuthenticated) {
        showHeaderUserMenu();
        hideHeaderInfoMenu();
      }
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
            <Image
              id="urban-square-logo"
              alt="urban-square-page"
              src={`${basePath}/UrbanSquare.svg`}
              width={180}
              height={120}
            />
            {/* Sistema Logo */}
            <Link href="https://www.sistema.at/">
              <Image
                id="service-logo"
                alt="service-home"
                src={`${basePath}/sistemaLogo.png`}
                width={80}
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
            {/* IPCC Logo with Modal */}
            <Image
              id="ipcc-logo"
              alt="IPCC Logo"
              src={`${basePath}/ipcc.png`}
              width={50}
              height={36}
              style={headerStyles.logo}
              onClick={openModal}
            />

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
                  href="/docs"
                  style={headerStyles.frameLink}
                >
                  Docs
                </Link>
                <Link
                  className="frame-link"
                  href="/support"
                  style={headerStyles.frameLink}
                >
                  Support
                </Link>
              </div>
            </div>

            {/* User Container */}
            <div id="user-container" style={headerStyles.userContainer}>
              <div
                id="login-div"
                style={headerStyles.loginDiv}
                onClick={toggleUserMenu}
              >
                <Link
                  className="login-a not-logged"
                  href="#"
                  style={{
                    ...headerStyles.loginA,
                    ...(userIsAuthenticated
                      ? headerStyles.notLogged
                      : headerStyles.logged),
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      ...headerStyles.loginIcon,
                      ...(userIsAuthenticated
                        ? headerStyles.notLogged
                        : headerStyles.logged),
                    }}
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <p
                    className="login-text not-logged"
                    style={{
                      ...headerStyles.loginText,
                      ...(userIsAuthenticated
                        ? headerStyles.notLogged
                        : headerStyles.logged),
                    }}
                  >
                    Sign In
                  </p>
                </Link>

                <div
                  className="login-a logged"
                  style={{
                    ...headerStyles.loginA,
                    ...(userIsAuthenticated
                      ? headerStyles.logged
                      : headerStyles.notLogged),
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      ...headerStyles.loginIcon,
                      ...(userIsAuthenticated
                        ? headerStyles.logged
                        : headerStyles.notLogged),
                    }}
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <p
                    className="login-text logged"
                    style={{
                      ...headerStyles.loginText,
                      ...(userIsAuthenticated
                        ? headerStyles.logged
                        : headerStyles.notLogged),
                    }}
                  >
                    User Name
                  </p>
                </div>
              </div>

              {/* User Menu */}
              <div
                id="user-frame"
                className="logged"
                ref={userFrameRef}
                style={{
                  ...headerStyles.userFrame,
                  ...(userIsAuthenticated ? {} : headerStyles.notLogged),
                }}
              >
                <Link
                  className="frame-link"
                  href="/account"
                  style={headerStyles.frameLink}
                >
                  Account Settings
                </Link>
                <Link
                  className="frame-link"
                  href="/logout"
                  style={headerStyles.frameLink}
                >
                  Logout
                </Link>
              </div>
            </div>

            {/* Mobile menu icon */}
            <div
              id="menu-icon-container"
              style={headerStyles.menuIconContainer}
              onClick={toggleDropdownMenu}
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
                id="menu-icon"
                style={headerStyles.menuIcon}
              >
                {dropdownIsVisible ? (
                  // X icon
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  // Menu icon
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Container */}
      <div
        id="dropdown-menu-container"
        ref={dropdownMenuContainerRef}
        style={headerStyles.dropdownMenuContainer}
      >
        <div className="dropdown-link" style={headerStyles.dropdownLink}>
          <Link href="#" style={headerStyles.dropdownLinkA}>
            Home
          </Link>
        </div>
        <div className="dropdown-link" style={headerStyles.dropdownLink}>
          <Link href="#" style={headerStyles.dropdownLinkA}>
            Service Link 1
          </Link>
        </div>
        <div className="dropdown-link" style={headerStyles.dropdownLink}>
          <Link href="#" style={headerStyles.dropdownLinkA}>
            Service Link 2
          </Link>
        </div>
        <div className="dropdown-link" style={headerStyles.dropdownLink}>
          <Link href="#" style={headerStyles.dropdownLinkA}>
            Service Link 3
          </Link>
        </div>
        <div className="dropdown-link" style={headerStyles.dropdownLink}>
          <Link href="#" style={headerStyles.dropdownLinkA}>
            Service Link 4
          </Link>
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
