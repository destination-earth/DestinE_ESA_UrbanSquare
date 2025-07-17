import { useState, useEffect } from "react";

interface UseAuthReturn {
  userIsAuthenticated: boolean;
  userName: string;
  getLoginUrl: () => string;
}

export const useAuth = (): UseAuthReturn => {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("User");

  // Authentication check
  useEffect(() => {
    fetch("https://destinationearth.murmureo.com/urban-square/oauth2/userinfo", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) throw new Error("Not authenticated");
        return response.json();
      })
      .then(data => {
        const fetchedUserName = data.preferredUsername || "User";
        setUserName(fetchedUserName);
        setUserIsAuthenticated(true);
      })
      .catch(error => {
        console.warn("User not authenticated", error);
        setUserIsAuthenticated(false);
      });
  }, []);

  // Get current host and escaped URI for login redirect
  const getLoginUrl = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const escapedUri = encodeURIComponent(window.location.pathname + window.location.search);
      return `https://destinationearth.murmureo.com/urban-square/oauth2/start?rd=https://${host}${escapedUri}`;
    }
    return '#';
  };

  return {
    userIsAuthenticated,
    userName,
    getLoginUrl
  };
};