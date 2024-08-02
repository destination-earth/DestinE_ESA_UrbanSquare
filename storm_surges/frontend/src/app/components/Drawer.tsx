import React from "react";
import DrawerSection from "./DrawerSection";
import ToggleButton from "./ToggleButton";
import StormSurgeSlider from "./StormSurgeSlider";

interface DrawerProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  handleConfidenceChange: (level: string) => void;
  handleStormSurgeChange: (value: number) => void;
  handleYearChange: (year: string) => void;
  confidenceLevel: string;
  selectedSSP: string;
  setSelectedSSP: (ssp: string) => void; // Add setter function prop
  selectedYear: string;
  stormSurge: number;
  isLoading: boolean;
  toggleOverlayLayer: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  isDrawerOpen,
  toggleDrawer,
  handleConfidenceChange,
  handleStormSurgeChange,
  handleYearChange,
  confidenceLevel,
  selectedSSP,
  setSelectedSSP, // Use setter function
  selectedYear,
  stormSurge,
  isLoading,
  toggleOverlayLayer,
}) => {
  return (
    <div
      className={`absolute left-0 bottom-0 z-[99999] bg-white shadow-md transition-transform opacity-80 ${
        isDrawerOpen ? "transform-none" : "-translate-x-full"
      } w-[90%] max-w-[650px] overflow-y-auto`}
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "#807E80",
        height: "auto", // Set height to auto
        maxHeight: "50vh", // Ensure it doesn't overflow the viewport height
      }}
    >
      <div className="relative flex flex-col h-full">
        <div className="relative flex flex-col">
          <button
            onClick={toggleDrawer}
            style={{
              position: "absolute",
              right: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4 text-black pt-4 pl-4">
            What-if Scenario Configuration
          </h2>
          <hr className="border-black mb-4 w-full" />

          <div className="flex-grow overflow-y-auto p-2 flex flex-wrap">
            {/* Column 1 */}
            <div style={{ flex: "1", minWidth: "200px", borderRight: "1px solid black", paddingLeft: "1rem" }}>
              <DrawerSection title="Confidence Level">
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="confidenceLevel"
                    className="mr-2"
                    onChange={() => handleConfidenceChange("Low")}
                    checked={confidenceLevel === "Low"}
                  />{" "}
                  Low
                </label>
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="confidenceLevel"
                    className="mr-2"
                    onChange={() => handleConfidenceChange("Medium")}
                    checked={confidenceLevel === "Medium"}
                  />{" "}
                  Medium
                </label>
              </DrawerSection>

              <DrawerSection title="SSP">
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="ssp"
                    className="mr-2"
                    disabled={confidenceLevel === "Low"}
                    checked={selectedSSP === "ssp119"}
                    onChange={() => setSelectedSSP("ssp119")}
                  />{" "}
                  119
                </label>
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="ssp"
                    className="mr-2"
                    checked={selectedSSP === "ssp126"}
                    onChange={() => setSelectedSSP("ssp126")}
                  />{" "}
                  126
                </label>
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="ssp"
                    className="mr-2"
                    checked={selectedSSP === "ssp245"}
                    onChange={() => setSelectedSSP("ssp245")}
                  />{" "}
                  245
                </label>
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="ssp"
                    className="mr-2"
                    disabled={confidenceLevel === "Low"}
                    checked={selectedSSP === "ssp370"}
                    onChange={() => setSelectedSSP("ssp370")}
                  />{" "}
                  370
                </label>
                <label className="block mb-2 text-black">
                  <input
                    type="radio"
                    name="ssp"
                    className="mr-2"
                    checked={selectedSSP === "ssp585"}
                    onChange={() => setSelectedSSP("ssp585")}
                  />{" "}
                  585
                </label>
              </DrawerSection>
            </div>

            {/* Column 2 */}
            <DrawerSection
              title="Year"
              style={{ flex: "1", minWidth: "200px", borderRight: "1px solid black", paddingLeft: "1rem" }}
            >
              <label className="block mb-[19.5px] text-black">
                <input
                  type="radio"
                  name="year"
                  className="mr-2"
                  checked={selectedYear === "2040"}
                  onChange={() => handleYearChange("2040")}
                />{" "}
                2040
              </label>
              <label className="block mb-[19.5px] text-black">
                <input
                  type="radio"
                  name="year"
                  className="mr-2"
                  checked={selectedYear === "2060"}
                  onChange={() => handleYearChange("2060")}
                />{" "}
                2060
              </label>
              <label className="block mb-[19.5px] text-black">
                  <input
                    type="radio"
                    name="year"
                    className="mr-2"
                    checked={selectedYear === "2080"}
                    onChange={() => handleYearChange("2080")}
                  />{" "}
                  2080
                </label>
                <label className="block mb-[19.5px] text-black">
                  <input
                    type="radio"
                    name="year"
                    className="mr-2"
                    checked={selectedYear === "2100"}
                    onChange={() => handleYearChange("2100")}
                  />{" "}
                  2100
                </label>
                <label className="block mb-[19.5px] text-black">
                  <input
                    type="radio"
                    name="year"
                    className="mr-2"
                    checked={selectedYear === "2120"}
                    onChange={() => handleYearChange("2120")}
                  />{" "}
                  2120
                </label>
                <label className="block mb-[19.5px] text-black">
                  <input
                    type="radio"
                    name="year"
                    className="mr-2"
                    checked={selectedYear === "2150"}
                    onChange={() => handleYearChange("2150")}
                  />{" "}
                  2150
                </label>
            </DrawerSection>

            {/* Column 3 */}
            <DrawerSection
              title="Storm Surge"
              style={{ flex: "1", minWidth: "200px", paddingLeft: "1rem" }}
            >
              <div className="flex flex-col items-start ml-7">
                <StormSurgeSlider
                  value={stormSurge}
                  onChange={handleStormSurgeChange}
                />
              </div>
            </DrawerSection>
          </div>
          <ToggleButton
            isLoading={isLoading}
            toggleOverlayLayer={toggleOverlayLayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Drawer;
