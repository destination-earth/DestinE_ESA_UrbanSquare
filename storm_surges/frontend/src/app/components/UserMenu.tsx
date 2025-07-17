import React, { forwardRef } from "react";
import Link from "next/link";
import { headerStyles } from "./header.styles";

interface UserMenuProps {
  isAuthenticated: boolean;
  userName: string;
  loginHover: boolean;
  isMobile: boolean;
  onLoginHover: (hover: boolean) => void;
  onToggleMenu: () => void;
  getLoginUrl: () => string;
  userFrameRef: React.RefObject<HTMLDivElement>;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isAuthenticated,
  userName,
  loginHover,
  isMobile,
  onLoginHover,
  onToggleMenu,
  getLoginUrl,
  userFrameRef,
}) => {
  return (
    <div id="user-container" style={headerStyles.userContainer}>
      <div
        id="login-div"
        style={{
          ...headerStyles.loginDiv,
          ...(loginHover ? headerStyles.loginDivHover : {}),
          ...(isMobile ? { padding: "0 9px" } : {})
        }}
        onMouseEnter={() => onLoginHover(true)}
        onMouseLeave={() => onLoginHover(false)}
        onClick={isAuthenticated ? onToggleMenu : undefined}
      >
        {!isAuthenticated ? (
          <Link
            href={getLoginUrl()}
            style={headerStyles.loginLink}
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
              style={headerStyles.loginIcon}
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            {!isMobile && <p style={headerStyles.loginText}>Sign In</p>}
          </Link>
        ) : (
          <div style={headerStyles.loginLink}>
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
              style={headerStyles.loginIcon}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {!isMobile && <p style={headerStyles.loginText}>{userName}</p>}
          </div>
        )}
      </div>

      {/* User Dropdown Menu */}
      {isAuthenticated && (
        <div
          id="user-frame"
          ref={userFrameRef}
          style={{
            ...headerStyles.userFrame,
            ...(isMobile ? { left: "auto", right: "-20px" } : {})
          }}
        >
          <Link
            className="frame-link"
            href="https://iam.prod.desp.space/realms/desp/account/"
            style={headerStyles.frameLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Account Settings
          </Link>
          <Link
            className="frame-link"
            href="/urban-square/oauth2/sign_out"
            style={headerStyles.frameLink}
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;