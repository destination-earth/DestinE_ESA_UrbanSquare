import React from "react";

interface DrawerSectionProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties; // Add this line to accept style prop
}

const DrawerSection: React.FC<DrawerSectionProps> = ({ title, children, style }) => {
  return (
    <div style={style}>
      <h3 className="text-[15px] font-bold mb-2 text-black">{title}</h3>
      {children}
    </div>
  );
};

export default DrawerSection;
