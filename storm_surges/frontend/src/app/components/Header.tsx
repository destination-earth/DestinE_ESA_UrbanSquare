// src/app/components/Header.tsx
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#0D1527",
        padding: 0,
        textAlign: "left",
        color: "white",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
        <Image
          src="/desp_logo.svg"
          alt="sistema gmbh"
          width={40}
          height={40}
          style={{ marginRight: "1rem" }}
        />
        <h1 style={{ margin: 0 }}>
          Destination Earth Urban Square - Global Inundation Risk Service
        </h1>
      </div>
      <div
        style={{
          width: "100%",
          height: "4px", /* Adjust the height as needed */
          background: "linear-gradient(to right, yellow, #F76501)",
        }}
      ></div>
    </header>
  );
};

export default Header;
