"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const footerStyles = {
  footerContainer: {
    boxSizing: "border-box" as const,
    position: "fixed" as const,
    bottom: 0,
    width: "100vw",
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
    borderTop: "solid 2px #7B34DB",
    zIndex: 1000, // Increased z-index to appear above the map
  } as React.CSSProperties,
  footerInnerContainer: {
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
  footerLeftContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  footerCentralContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  footerRightContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  footerDespLogo: {
    display: "block",
    maxWidth: "64px",
    maxHeight: "40px",
    width: "64px",
    height: "40px",
  } as React.CSSProperties,
  footerLogo: {
    maxWidth: "80px",
    maxHeight: "40px",
    width: "auto",
    height: "auto",
    marginLeft: "10px",
    marginRight: "10px",
  } as React.CSSProperties,
  footerMenuIcon: {
    width: "40px",
    height: "40px",
    transition: "color 250ms ease-in-out",
    color: "#FFFFFF",
    cursor: "pointer",
  } as React.CSSProperties,
  footerMenuIconHover: {
    color: "#7A7A7A",
  } as React.CSSProperties,
  footerMenu: {
    position: "absolute" as const,
    display: "none",
    right: 0,
    bottom: "64px",
    width: "240px",
    backgroundColor: "#0D1527BB",
    flexDirection: "column" as const,
    padding: 0,
    margin: 0,
    gap: "0px",
    fontSize: "16px",
    zIndex: 1001, // Give the menu an even higher z-index so it appears above the footer
  } as React.CSSProperties,
  footerMenuDivider: {
    color: "#3C3C3C",
    margin: "0 3px",
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
  footerFrameLink: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 0,
    transition: "color 250ms ease-in-out",
    cursor: "pointer",
  } as React.CSSProperties,
  footerFrameLinkHover: {
    backgroundColor: "#1E2637",
  } as React.CSSProperties,
  mobileFooterLogo: {
    maxWidth: "80px",
    maxHeight: "40px",
    width: "auto",
    height: "auto",
  } as React.CSSProperties,
  mobileLink: {
    display: "block",
  } as React.CSSProperties,
  mobileLinkHidden: {
    display: "none",
  } as React.CSSProperties,
};

const Footer = () => {
  const basePath = process.env.BASEPATH || '';
  
  // State variables
  const [footerMenuIsVisible, setFooterMenuIsVisible] = useState(false);
  const [footerHasRevealed, setFooterHasRevealed] = useState(true);
  
  // Refs
  const footerRef = useRef<HTMLDivElement>(null);
  const footerMenuRef = useRef<HTMLDivElement>(null);
  const footerMenuIconRef = useRef<SVGSVGElement>(null);
  
  // For tracking scroll position
  const footerScrollPositionPrecRef = useRef(0);
  const tempFooterPrevPosRef = useRef(0);
  const footerHidingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const footerHeight = "64px";
  const footerHideTimeout = 4000;

  // Function to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const deltaY = window.scrollY - tempFooterPrevPosRef.current;
      
      if (window.scrollY >= (document.documentElement.scrollHeight - window.innerHeight - 50)) {
        showFooter();
      } else {
        if (deltaY < 0 && deltaY > -100) {
          setTimeout(() => {
            footerScrollPositionPrecRef.current = window.scrollY;
          }, 500);
          
          if (footerHasRevealed) {
            if (footerHidingTimeoutIdRef.current) {
              clearTimeout(footerHidingTimeoutIdRef.current);
            }
            
            hideFooter();
            setTimeout(() => {
              hideFooterMenu();
            }, 500);
          }
        } else if (deltaY > 0 && deltaY < 100) {
          if (window.scrollY - footerScrollPositionPrecRef.current > 0) {
            showFooter();
            
            footerHidingTimeoutIdRef.current = setTimeout(() => {
              hideFooter();
            }, footerHideTimeout);
          }
        }
      }
      
      tempFooterPrevPosRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (footerHidingTimeoutIdRef.current) {
        clearTimeout(footerHidingTimeoutIdRef.current);
      }
    };
  }, [footerHasRevealed]);

  // Mouse events for footer
  useEffect(() => {
    if (!footerRef.current) return;
    
    const handleMouseOver = () => {
      if (footerHidingTimeoutIdRef.current) {
        clearTimeout(footerHidingTimeoutIdRef.current);
      }
    };
    
    const handleMouseLeave = () => {
      if (footerHidingTimeoutIdRef.current) {
        clearTimeout(footerHidingTimeoutIdRef.current);
      }
      
      footerHidingTimeoutIdRef.current = setTimeout(() => {
        hideFooter();
      }, footerHideTimeout);
    };
    
    // Mouse move handler for showing footer when near bottom
    const handleMouseMove = (e: MouseEvent) => {
      if (e.y > window.innerHeight - 50) {
        showFooter();
      }
    };
    
    footerRef.current.addEventListener('mouseover', handleMouseOver);
    footerRef.current.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      if (footerRef.current) {
        footerRef.current.removeEventListener('mouseover', handleMouseOver);
        footerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Media query handler for mobile link display
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1025px)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      const mobileLinks = document.getElementsByClassName('mobile-link');
      
      for (let i = 0; i < mobileLinks.length; i++) {
        const element = mobileLinks[i] as HTMLElement;
        element.style.display = e.matches ? 'none' : 'block';
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // Initial check
    const mobileLinks = document.getElementsByClassName('mobile-link');
    for (let i = 0; i < mobileLinks.length; i++) {
      const element = mobileLinks[i] as HTMLElement;
      element.style.display = mediaQuery.matches ? 'none' : 'block';
    }
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  // Function to hide footer
  const hideFooter = () => {
    if (footerRef.current && document.documentElement.scrollHeight !== window.innerHeight && 
        window.scrollY < (document.documentElement.scrollHeight - window.innerHeight - 50)) {
      setFooterHasRevealed(false);
      footerRef.current.style.transition = 'bottom 500ms ease-in-out, background-color 500ms ease-in-out';
      footerRef.current.style.bottom = `-${footerHeight}`;
    }
  };

  // Function to show footer
  const showFooter = () => {
    if (footerRef.current) {
      footerRef.current.style.transition = 'bottom 250ms ease-in-out, background-color 500ms ease-in-out';
      footerRef.current.style.bottom = '0px';
      footerRef.current.style.position = 'fixed';
      
      setTimeout(() => {
        setFooterHasRevealed(true);
      }, 500);
      
      if (footerHidingTimeoutIdRef.current) {
        clearTimeout(footerHidingTimeoutIdRef.current);
      }
    }
  };

  // Function to hide footer menu
  const hideFooterMenu = () => {
    if (footerMenuRef.current) {
      footerMenuRef.current.style.display = 'none';
      setFooterMenuIsVisible(false);
    }
  };

  // Toggle footer menu
  const toggleFooterMenu = () => {
    if (footerMenuIsVisible) {
      hideFooterMenu();
    } else {
      if (footerMenuRef.current) {
        footerMenuRef.current.style.display = 'flex';
        setFooterMenuIsVisible(true);
      }
    }
  };

  return (
    <div 
      id="footer-container" 
      ref={footerRef}
      style={footerStyles.footerContainer}
    >
      <div id="footer-inner-container" style={footerStyles.footerInnerContainer}>
        {/* Left Container */}
        <div id="footer-left-container" style={footerStyles.footerLeftContainer}>
          <Link href="https://destination-earth.eu">
            <Image 
              id="footer-desp-logo" 
              alt="desp-home" 
              src={`${basePath}/desp_logo.svg`} 
              width={64} 
              height={40}
            />
          </Link>
        </div>

        {/* Central Container */}
        <div id="footer-central-container" style={footerStyles.footerCentralContainer}>
          <Link href="https://destination-earth.eu">
            <Image 
              className="footer-logo" 
              alt="destination earth" 
              src={`${basePath}/destination-earth.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          </Link>
          <Link href="https://european-union.europa.eu/">
            <Image 
              className="footer-logo" 
              alt="eu commission" 
              src={`${basePath}/funded-by-EU.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          </Link>
          {/* <Link href="#"> */}
            <Image 
              className="footer-logo" 
              alt="implemented by" 
              src={`${basePath}/implemented-by.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          {/* </Link> */}
          <Link href="https://www.ecmwf.int/">
            <Image 
              className="footer-logo" 
              alt="ecmwf" 
              src={`${basePath}/ecmwf.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          </Link>
          <Link href="https://www.esa.int/">
            <Image 
              className="footer-logo" 
              alt="esa" 
              src={`${basePath}/esa.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          </Link>
          <Link href="https://www.eumetsat.int/">
            <Image 
              className="footer-logo" 
              alt="eumetsat" 
              src={`${basePath}/eumetsat.png`} 
              width={80} 
              height={40}
              style={footerStyles.footerLogo}
            />
          </Link>
        </div>

        {/* Right Container */}
        <div id="footer-right-container" style={footerStyles.footerRightContainer}>
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
            id="footer-menu-icon"
            ref={footerMenuIconRef}
            style={footerStyles.footerMenuIcon}
            onClick={toggleFooterMenu}
          >
            {footerMenuIsVisible ? (
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

      {/* Footer menu */}
      <div id="footer-menu" ref={footerMenuRef} style={footerStyles.footerMenu}>
        <Link className="frame-link" href="/code-of-conduct" style={footerStyles.frameLink}>
          Code of Conduct
        </Link>
        <Link className="frame-link" href="/terms-and-conditions" style={footerStyles.frameLink}>
          Terms and Conditions
        </Link>
        <Link className="frame-link" href="/privacy-policies" style={footerStyles.frameLink}>
          Privacy Policies
        </Link>
        <Link className="frame-link" href="/legal-notice" style={footerStyles.frameLink}>
          Legal Notice
        </Link>
        <div className="mobile-link" style={footerStyles.mobileLink}>
          <hr style={footerStyles.footerMenuDivider} />
          <Link className="footer-frame-link" href="https://destination-earth.eu" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="destination earth" 
              src={`${basePath}/destination-earth.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
          <Link className="footer-frame-link" href="https://european-union.europa.eu/" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="eu commission" 
              src={`${basePath}/funded-by-EU.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
          <Link className="footer-frame-link" href="#" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="implemented by" 
              src={`${basePath}/implemented-by.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
          <Link className="footer-frame-link" href="https://www.ecmwf.int/" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="ecmwf" 
              src={`${basePath}/ecmwf.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
          <Link className="footer-frame-link" href="https://www.esa.int/" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="esa" 
              src={`${basePath}/esa.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
          <Link className="footer-frame-link" href="https://www.eumetsat.int/" style={footerStyles.footerFrameLink}>
            <Image 
              className="mobile-footer-logo" 
              alt="eumetsat" 
              src={`${basePath}/eumetsat.png`} 
              width={80} 
              height={40}
              style={footerStyles.mobileFooterLogo}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;