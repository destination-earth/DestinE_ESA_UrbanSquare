"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Import styles and constants
import { headerStyles, gradientKeyframes } from "./header.styles";

// Import components
import IpccModal from "./IpccModal";
import UserMenu from "./UserMenu";

// Import custom hooks
import { useScrollBehavior } from "./useScrollBehavior";
import { useAuth } from "./useAuth";
import { useResponsive } from "./useResponsive";

const Header = () => {
  const basePath = process.env.BASEPATH || "";

  // State variables
  const [headerInfoMenuIsVisible, setHeaderInfoMenuIsVisible] = useState(false);
  const [headerUserMenuIsVisible, setHeaderUserMenuIsVisible] = useState(false);
  const [headerHasRevealed, setHeaderHasRevealed] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loginHover, setLoginHover] = useState(false);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const infoFrameRef = useRef<HTMLDivElement>(null);
  const userFrameRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { userIsAuthenticated, userName, getLoginUrl } = useAuth();
  const { isMobile, isTablet, isSmallMobile } = useResponsive();

  // Modal functions
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Insert keyframes into document
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = gradientKeyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Menu visibility functions
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

  // Toggle menus
  const toggleInfoMenu = () => {
    if (headerInfoMenuIsVisible) {
      hideHeaderInfoMenu();
    } else {
      showHeaderInfoMenu();
      hideHeaderUserMenu();
    }
  };

  const toggleUserMenu = () => {
    if (!userIsAuthenticated) return;

    if (headerUserMenuIsVisible) {
      hideHeaderUserMenu();
    } else {
      showHeaderUserMenu();
      hideHeaderInfoMenu();
    }
  };

  // Use custom scroll behavior hook
  useScrollBehavior({
    headerRef,
    headerHasRevealed,
    setHeaderHasRevealed,
    hideHeaderInfoMenu,
    hideHeaderUserMenu,
  });

  // Dynamic styles based on viewport
  const getLogoStyles = () => {
    if (isSmallMobile) {
      return {
        destinationEarth: {
          ...headerStyles.destinationEarthLogo,
          display: "none",
        },
        urbanSquare: {
          ...headerStyles.urbanSquareLogo,
          display: "block",
          maxWidth: "100px",
          height: "25px",
        },
        sistema: {
          ...headerStyles.sistemaLogo,
          maxWidth: "60px",
          height: "30px",
        },
        gap: "8px",
      };
    } else if (isTablet) {
      return {
        destinationEarth: {
          ...headerStyles.destinationEarthLogo,
          maxWidth: "120px",
          height: "28px",
        },
        urbanSquare: {
          ...headerStyles.urbanSquareLogo,
          maxWidth: "100px",
          height: "28px",
        },
        sistema: {
          ...headerStyles.sistemaLogo,
          maxWidth: "70px",
          height: "35px",
        },
        gap: "10px",
      };
    } else if (isMobile) {
      return {
        destinationEarth: headerStyles.destinationEarthLogo,
        urbanSquare: headerStyles.urbanSquareLogo,
        sistema: headerStyles.sistemaLogo,
        gap: "15px",
      };
    }
    return {
      destinationEarth: headerStyles.destinationEarthLogo,
      urbanSquare: headerStyles.urbanSquareLogo,
      sistema: headerStyles.sistemaLogo,
      gap: "20px",
    };
  };

  const logoStyles = getLogoStyles();

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
          style={{
            ...headerStyles.headerInnerContainer,
            padding: isSmallMobile ? "0 10px" : "0 20px",
          }}
        >
          {/* Left container with logos */}
          <div
            id="left-container"
            style={{
              ...headerStyles.leftContainer,
              gap: logoStyles.gap,
            }}
          >
            <Link
              href="https://destination-earth.eu"
              style={headerStyles.logoLink}
            >
              <Image
                id="eu-flag-de"
                alt="destine platform home"
                src={`${basePath}/destination_earth_logo.svg`}
                width={160}
                height={35}
                style={logoStyles.destinationEarth}
                priority
              />
            </Link>
            <Link
              href="https://destinationearth.murmureo.com/urban-square/"
              style={headerStyles.logoLink}
            >
              <Image
                id="urban-square-logo"
                alt="urban-square-page"
                src={`${basePath}/urbansquare.png`}
                width={140}
                height={35}
                style={logoStyles.urbanSquare}
              />
            </Link>
            <Link href="https://www.sistema.at/" style={headerStyles.logoLink}>
              <Image
                id="service-logo"
                alt="service-home"
                src={`${basePath}/sistemaLogo.png`}
                width={100}
                height={50}
                style={logoStyles.sistema}
              />
            </Link>
          </div>

          {/* Right container with actions */}
          <div
            id="right-container"
            style={{
              ...headerStyles.rightContainer,
              gap: isSmallMobile ? "10px" : "15px",
            }}
          >
            {/* Info Button */}
            <div id="info-container" style={headerStyles.infoContainer}>
              <div
                id="info-button"
                style={headerStyles.infoButton}
                onClick={toggleInfoMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isSmallMobile ? "20" : "24"}
                  height={isSmallMobile ? "20" : "24"}
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
                  href="https://platform.destine.eu/services/documents-and-api/doc/?service_name=urban-square"
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

            {/* IPCC Logo - Hide on very small screens */}
            {!isSmallMobile && (
              <Image
                id="ipcc-logo"
                alt="IPCC Logo"
                src={`${basePath}/ipcc.png`}
                width={35}
                height={36}
                style={{
                  ...headerStyles.ipccLogo,
                  height: isTablet ? "28px" : "32px",
                }}
                onClick={openModal}
              />
            )}

            {/* User/Login Component */}
            <UserMenu
              isAuthenticated={userIsAuthenticated}
              userName={userName}
              loginHover={loginHover}
              isMobile={isMobile}
              onLoginHover={setLoginHover}
              onToggleMenu={toggleUserMenu}
              getLoginUrl={getLoginUrl}
              userFrameRef={userFrameRef}
            />
          </div>
        </div>
      </div>

      {/* IPCC Modal Component */}
      <IpccModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Header;
