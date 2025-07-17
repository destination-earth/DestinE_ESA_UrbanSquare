import { useState, useEffect } from "react";
import { HEADER_CONSTANTS } from "./header.styles";

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width <= HEADER_CONSTANTS.mobileBreakpoint);
      setIsTablet(width <= HEADER_CONSTANTS.tabletBreakpoint);
      setIsSmallMobile(width <= HEADER_CONSTANTS.smallMobileBreakpoint);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return { isMobile, isTablet, isSmallMobile };
};