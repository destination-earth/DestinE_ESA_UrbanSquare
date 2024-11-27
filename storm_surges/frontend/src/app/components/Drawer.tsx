import React, { useEffect, useState } from "react";
import DrawerSection from "./DrawerSection";
import ToggleButton from "./ToggleButton";
import StormSurgeSlider from "./StormSurgeSlider";
import Image from "next/image";
import Modal from "./Modal";

interface DrawerProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  handleConfidenceChange: (level: string) => void;
  handleStormSurgeChange: (value: number) => void;
  handleYearChange: (year: string) => void;
  confidenceLevel: string;
  selectedSSP: string | null; // Allow null
  setSelectedSSP: (ssp: string | null) => void; // Allow null // Add setter function prop
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
  setSelectedSSP,
  selectedYear,
  stormSurge,
  isLoading,
  toggleOverlayLayer,
}) => {
  const isValidConfiguration = () => {
    return confidenceLevel && selectedSSP && selectedYear;
  };

  useEffect(() => {
    const disabledSSPs = confidenceLevel === "Low" ? ["ssp119", "ssp370"] : [];
    if (selectedSSP && disabledSSPs.includes(selectedSSP)) {
      setSelectedSSP(null);
    }
  }, [confidenceLevel, selectedSSP, setSelectedSSP]);

  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  const toggleInfoModal = () => {
    setInfoModalOpen(!isInfoModalOpen);
  };

  const basePath = process.env.BASEPATH || "";

  return (
    <div
      className={`absolute left-0 bottom-0 z-[99999] bg-white shadow-md transition-transform opacity-80 ${
        isDrawerOpen ? "transform-none" : "-translate-x-full"
      } w-[90%] max-w-[650px] overflow-y-auto`}
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "#807E80",
        height: "auto",
        maxHeight: "50vh", // Ensure it doesn't overflow the viewport height
      }}
    >
      <div className="relative flex flex-col h-full">
        <div className="relative flex flex-col">
          {/* New wrapper div with flex-row */}
          <div className="flex items-center pl-4 pt-4 pb-4">
            <h2 className="text-xl font-bold text-black">
              What-if Scenario Configuration
            </h2>
            <button
              className="ml-2"
              onClick={toggleInfoModal}
              style={{
                cursor: "pointer",
              }}
            >
              <Image
                src={`${basePath}/info.svg`}
                alt="Info"
                width="21"
                height="21"
              />
            </button>
          </div>
          {/* </div> */}
          <hr className="border-black mb-4 w-full" />

          <div className="flex-grow overflow-y-auto p-2 flex flex-wrap">
            {/* Column 1 */}
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                borderRight: "1px solid black",
                paddingLeft: "1rem",
              }}
            >
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
              style={{
                flex: "1",
                minWidth: "200px",
                borderRight: "1px solid black",
                paddingLeft: "1rem",
              }}
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
              <div className="flex  items-start ml-7">
                <StormSurgeSlider
                  value={stormSurge}
                  onChange={handleStormSurgeChange}
                />
                <button
                  onClick={toggleDrawer}
                  style={{
                    position: "absolute",
                    marginLeft: "96px",
                    marginTop: "50px",
                    right: "0px",
                    top: "120px",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    paddingRight: "2px",
                    paddingLeft: "2px",
                    background: "darkgray",
                    borderLeft: "1px solid black",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={basePath + "/drawerArrowBack.svg"}
                    alt="Open Drawer"
                    width="21"
                    height="21"
                  />
                </button>
              </div>
            </DrawerSection>
          </div>
          <ToggleButton
            isLoading={isLoading}
            toggleOverlayLayer={toggleOverlayLayer}
            isDisabled={!isValidConfiguration()}
          />
        </div>
      </div>
      {isInfoModalOpen && (
        <Modal onClose={toggleInfoModal}>
          <div style={{ padding: "20px", backgroundColor: "black", color: "white"}}>
            <p>
              <strong>Confidence Level</strong>
              <br />
              Medium: 50% chance
              <br />
              Low: 20% chance
              <br />
              The confidence levels in IPCC reports are used to convey the
              degree of certainty in scientific findings and predictions,
              determined through the consistency of evidence, the robustness of
              methodologies, and the level of agreement among experts.
            </p>
            <p>
              <br />
              <strong>SSP</strong>
              <br />A Shared Socioeconomic Pathway (SSP) is a future scenario
              that considers climate change and socio-economic global changes
              (natural resources, population growth). SSPs range from optimistic
              to pessimistic scenarios: in SSP119, it is assumed that society
              will be taking “the green road” towards a more sustainable planet;
              while in SSP585 a complete fossil-fueled development is
              considered. The definition of the five Shared Socioeconomic
              Pathway (SSP) scenarios used to develop the IPCC AR 6 sea level
              rise projections applied in this service are described below.
              <br />
              <ul>
                <li>
                  <strong>SSP119</strong>: holds warming to approximately 1.5°C
                  above 1850-1900 in 2100 after slight overshoot (median) and
                  implies net zero CO2 emissions around the middle of the
                  century.
                </li>
                <br />
                <li>
                  <strong>SSP126</strong>: stays below 2.0°C warming relative to
                  1850-1900 (median) with implied net zero emissions in the
                  second half of the century.
                </li>
                <br />
                <li>
                  <strong>SSP245</strong>: is approximately in line with the
                  upper end of aggregate Nationally Determined Contribution
                  emission levels by 2030. SR1.5 assessed temperature
                  projections for NDCs to be between 2.7 and 3.4°C by 2100,
                  corresponding to the upper half of projected warming under
                  SP245. New or updated NDCs by the end of 2020 did not
                  significantly change the emissions projections up to 2030,
                  although more countries adopted 2050 net zero targets in line
                  with SSP119 or SSP126. The SSP245 scenario deviates mildly
                  from a ‘no-additional- climate-policy’ reference scenario,
                  resulting in a best-estimate warming around 2.7°C by the end
                  of the 21st century relative to 1850-1900.
                </li>
                <br />
                <li>
                  <strong>SSP370</strong>: is a medium to high reference
                  scenario resulting from no additional climate policy under the
                  SSP3 socioeconomic development narrative. SSP370 has
                  particularly high non-CO2 emissions, including high aerosols
                  emissions.
                </li>
                <br />
                <li>
                  <strong>SSP585</strong>: is a high reference scenario with no
                  additional climate policy. Emission levels as high as SSP585
                  are not obtained by Integrated Assessment Models (IAMs) under
                  any of the SSPs other than the fossil fueled SSP5
                  socioeconomic development pathway.
                </li>
              </ul>
            </p>
            <br />
            <p>
              <strong>Year</strong>
              <br />
              Modelled year (2040-2150).
            </p>
            <br />
            <p>
              <strong>Storm Surge</strong>
              <br />A storm surge is defined as the unusual rise in seawater
              level during a storm measured as the height of the water above the
              normal predicted astronomical tide. For this study we consider
              storm surge heights between 0 (none) and 5 metres.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Drawer;
