import { useEffect, useRef, RefObject } from "react";
import { HEADER_CONSTANTS } from "./header.styles";

interface UseScrollBehaviorProps {
  headerRef: RefObject<HTMLDivElement>;
  headerHasRevealed: boolean;
  setHeaderHasRevealed: (value: boolean) => void;
  hideHeaderInfoMenu: () => void;
  hideHeaderUserMenu: () => void;
}

export const useScrollBehavior = ({
  headerRef,
  headerHasRevealed,
  setHeaderHasRevealed,
  hideHeaderInfoMenu,
  hideHeaderUserMenu,
}: UseScrollBehaviorProps) => {
  const scrollPositionPrecRef = useRef(0);
  const tempPrevPosRef = useRef(0);
  const hidingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { backgroundColor, backgroundColorTransparent, headerHeight, hideTimeout } = HEADER_CONSTANTS;

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
  }, [headerHasRevealed, setHeaderHasRevealed, hideHeaderInfoMenu, hideHeaderUserMenu, headerRef]);

  // Mouse over/leave handlers
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
  }, [headerRef, hideTimeout, headerHeight]);
};