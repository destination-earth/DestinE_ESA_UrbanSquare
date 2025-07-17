import { CSSProperties } from "react";

export const headerStyles = {
  headerContainer: {
    width: "100vw",
    maxWidth: "100vw",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    height: "64px",
    maxHeight: "64px",
    margin: 0,
    padding: 0,
    backgroundColor: "#0D1527FF",
    color: "#FFFFFF",
    fontFamily: "Roboto-Bold, sans-serif",
    fontSize: "16px",
    zIndex: 99,
  } as CSSProperties,
  
  headerInnerContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "0 20px",
    gap: "20px",
    boxSizing: "border-box" as const,
  } as CSSProperties,
  
  leftContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    gap: "10px",
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
  } as CSSProperties,
  
  centralContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-end",
    flexGrow: 1,
    margin: 0,
    padding: "0 40px",
  } as CSSProperties,
  
  rightContainer: {
    display: "flex",
    height: "100%",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "15px",
    flex: "0 0 auto",
  } as CSSProperties,
  
  headerLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    transition: "color 250ms ease-in-out",
  } as CSSProperties,
  
  headerLinkHover: {
    color: "#7A7A7A",
  } as CSSProperties,
  
  currentLink: {
    color: "#EF2B89",
  } as CSSProperties,
  
  infoContainer: {
    position: "relative",
    marginRight: "0px",
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,
  
  infoButton: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
    cursor: "pointer",
  } as CSSProperties,
  
  infoIcon: {
    width: "24px",
    height: "24px",
    transition: "color 250ms ease-in-out",
    color: "#FFFFFF",
  } as CSSProperties,
  
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
    zIndex: 9999,
  } as CSSProperties,
  
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
    zIndex: 9999,
  } as CSSProperties,
  
  frameLink: {
    textDecoration: "none",
    padding: "16px",
    transition: "color 250ms ease-in-out",
    cursor: "pointer",
    color: "#B7B7B7",
  } as CSSProperties,
  
  frameLinkHover: {
    backgroundColor: "#1E2637",
    color: "#7A7A7A",
  } as CSSProperties,
  
  // User/Login styles
  userContainer: {
    position: "relative" as const,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,
  
  loginDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "0 40px",
    height: "36px",
    borderRadius: "18px",
    background: "linear-gradient(90deg, #EF2B89 0%, #EF2B89 40%, #7B34DB 60%, #7B34DB 100%)",
    backgroundSize: "400% 100%",
    backgroundPosition: "50% 50%",
    cursor: "pointer",
    transition: "background-position 250ms ease-in-out",
  } as CSSProperties,
  
  loginDivHover: {
    backgroundPosition: "100% 50%",
  } as CSSProperties,
  
  loginLink: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    textDecoration: "none",
    color: "#FFFFFF",
  } as CSSProperties,
  
  loginIcon: {
    width: "18px",
    height: "18px",
    color: "#FFFFFF",
  } as CSSProperties,
  
  loginText: {
    maxWidth: "200px",
    font: "16px 'Roboto-Bold', sans-serif",
    color: "#FFFFFF",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
    margin: 0,
  } as CSSProperties,
  
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
    zIndex: 9999,
  } as CSSProperties,
  
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto" as const,
    color: "black",
  } as CSSProperties,
  
  modalButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#0D1527",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  } as CSSProperties,
  
  // Logo styles
  logoLink: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    flexShrink: 0,
  } as CSSProperties,
  
  destinationEarthLogo: {
    width: "auto",
    height: "30px",
    maxWidth: "140px",
    objectFit: "contain" as const,
  } as CSSProperties,
  
  urbanSquareLogo: {
    width: "auto", 
    height: "30px",
    maxWidth: "120px",
    objectFit: "contain" as const,
  } as CSSProperties,
  
  sistemaLogo: {
    width: "auto",
    height: "40px",
    maxWidth: "80px",
    objectFit: "contain" as const,
  } as CSSProperties,
  
  ipccLogo: {
    width: "auto",
    height: "32px",
    cursor: "pointer",
    flexShrink: 0,
  } as CSSProperties,
};

// Keyframes for gradient animation
export const gradientKeyframes = `
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

// Constants
export const HEADER_CONSTANTS = {
  backgroundColor: "#0D1527FF",
  backgroundColorTransparent: "#0D1527BB",
  headerHeight: "64px",
  hideTimeout: 2000,
  mobileBreakpoint: 1280,
  tabletBreakpoint: 768,
  smallMobileBreakpoint: 480,
};