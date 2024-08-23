// src/app/components/Footer.tsx
import Image from 'next/image';
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0D1527', display: 'flex', paddingTop: '6px', paddingBottom:'6px', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', color: 'white' }}>
    <div></div> {/* Empty div to push the logo to the end */}
    <Image src='./sistemaLogo.png' alt='sistema gmbh' width={80} height={80} />
  </footer>
  );
};

export default Footer;
