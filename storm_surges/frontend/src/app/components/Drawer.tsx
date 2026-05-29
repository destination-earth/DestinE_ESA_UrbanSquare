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
  selectedSSP: string | null;
  setSelectedSSP: (ssp: string | null) => void;
  selectedYear: string;
  stormSurge: number;
  isLoading: boolean;
  toggleOverlayLayer: () => void;
}

/* ── tiny inline styles for the custom radio ── */
const radioCSS = `
  .drawer-radio {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
    margin-right: 10px;
    position: relative;
  }
  .drawer-radio:hover:not(:disabled) {
    border-color: rgba(255,255,255,0.6);
  }
  .drawer-radio:checked {
    border-color: #e8764b;
    box-shadow: inset 0 0 0 3px #1b1d2a, inset 0 0 0 6px #e8764b;
  }
  .drawer-radio:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .drawer-panel {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.15) transparent;
  }
  .drawer-panel::-webkit-scrollbar {
    width: 4px;
  }
  .drawer-panel::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }

  .drawer-label {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,0.82);
    font-size: 0.875rem;
    padding: 5px 0;
    cursor: pointer;
    transition: color 0.15s;
    user-select: none;
  }
  .drawer-label:hover {
    color: #fff;
  }
  .drawer-label--disabled {
    opacity: 0.35;
    pointer-events: none;
  }

  /* Force readable text on the storm surge slider and its labels */
  .storm-surge-col,
  .storm-surge-col * {
    color: rgba(255,255,255,0.85);
  }
  .storm-surge-col span,
  .storm-surge-col label,
  .storm-surge-col p,
  .storm-surge-col div {
    color: rgba(255,255,255,0.85) !important;
  }

  .section-title {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
    margin-bottom: 10px;
  }
`;

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
    <>
      <style>{radioCSS}</style>

      <div
        className={`absolute left-0 bottom-0 z-[99999] transition-transform ${
          isDrawerOpen ? "transform-none" : "-translate-x-full"
        } w-[90%] max-w-[620px]`}
        style={{
          background: "linear-gradient(165deg, #1e2035 0%, #171928 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
          height: "auto",
          maxHeight: "50vh",
          backdropFilter: "blur(12px)",
          overflow: "visible",
        }}
      >
        <div className="drawer-panel relative flex flex-col h-full overflow-y-auto overflow-x-hidden">
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.01em",
                }}
              >
                What-if Scenario Configuration
              </h2>
              <button
                onClick={toggleInfoModal}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "0.7")
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <text
                    x="10"
                    y="14.5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    i
                  </text>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Content columns ── */}
          <div
            className="flex flex-wrap"
            style={{ padding: "16px 8px 8px 8px" }}
          >
            {/* Column 1 — Confidence + SSP */}
            <div
              style={{
                flex: "1",
                minWidth: "140px",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                paddingLeft: "16px",
                paddingRight: "12px",
              }}
            >
              {/* Confidence Level */}
              <div style={{ marginBottom: "16px" }}>
                <div className="section-title">Confidence Level</div>
                <label className={`drawer-label`}>
                  <input
                    type="radio"
                    name="confidenceLevel"
                    className="drawer-radio"
                    onChange={() => handleConfidenceChange("Low")}
                    checked={confidenceLevel === "Low"}
                  />
                  Low
                </label>
                <label className={`drawer-label`}>
                  <input
                    type="radio"
                    name="confidenceLevel"
                    className="drawer-radio"
                    onChange={() => handleConfidenceChange("Medium")}
                    checked={confidenceLevel === "Medium"}
                  />
                  Medium
                </label>
              </div>

              {/* SSP */}
              <div>
                <div className="section-title">SSP</div>
                {[
                  { value: "ssp119", label: "119" },
                  { value: "ssp126", label: "126" },
                  { value: "ssp245", label: "245" },
                  { value: "ssp370", label: "370" },
                  { value: "ssp585", label: "585" },
                ].map(({ value, label }) => {
                  const disabled =
                    confidenceLevel === "Low" &&
                    (value === "ssp119" || value === "ssp370");
                  return (
                    <label
                      key={value}
                      className={`drawer-label ${
                        disabled ? "drawer-label--disabled" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="ssp"
                        className="drawer-radio"
                        disabled={disabled}
                        checked={selectedSSP === value}
                        onChange={() => setSelectedSSP(value)}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Column 2 — Year */}
            <div
              style={{
                flex: "1",
                minWidth: "120px",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                paddingLeft: "16px",
                paddingRight: "12px",
              }}
            >
              <div className="section-title">Year</div>
              {["2040", "2060", "2080", "2100", "2120", "2150"].map((year) => (
                <label key={year} className="drawer-label">
                  <input
                    type="radio"
                    name="year"
                    className="drawer-radio"
                    checked={selectedYear === year}
                    onChange={() => handleYearChange(year)}
                  />
                  {year}
                </label>
              ))}
            </div>

            {/* Column 3 — Storm Surge */}
            <div
              className="storm-surge-col"
              style={{
                flex: "1",
                minWidth: "130px",
                paddingLeft: "16px",
                paddingRight: "12px",
                position: "relative",
              }}
            >
              <div className="section-title">Storm Surge (m)</div>
              <div className="flex items-start justify-center">
                <StormSurgeSlider
                  value={stormSurge}
                  onChange={handleStormSurgeChange}
                />
              </div>

              {/* Drawer toggle tab */}
              <button
                onClick={toggleDrawer}
                style={{
                  position: "absolute",
                  right: "-16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                  padding: "22px 10px",
                  background:
                    "linear-gradient(180deg, #3d4160 0%, #2f3350 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderLeft: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  boxShadow: "3px 0 10px rgba(0,0,0,0.35)",
                }}
              >
                <Image
                  src={basePath + "/drawerArrowBack.svg"}
                  alt="Open Drawer"
                  width="18"
                  height="18"
                  style={{ opacity: 0.9, filter: "brightness(2) invert(1)" }}
                />
              </button>
            </div>
          </div>

          {/* ── Footer action ── */}
          <div
            style={{
              padding: "10px 16px 14px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <ToggleButton
              isLoading={isLoading}
              toggleOverlayLayer={toggleOverlayLayer}
              isDisabled={!isValidConfiguration()}
              confidenceLevel={confidenceLevel}
              selectedSSP={selectedSSP}
              selectedYear={selectedYear}
              stormSurge={stormSurge}
            />
          </div>
        </div>
      </div>

      {/* ── Info Modal (outside drawer for proper centering) ── */}
      {isInfoModalOpen && (
        <Modal onClose={toggleInfoModal}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <p>
                <strong>Confidence Level</strong>
                <br />
                Medium: 50% chance
                <br />
                Low: 20% chance
                <br />
                The confidence levels in IPCC reports are used to convey the
                degree of certainty in scientific findings and predictions,
                determined through the consistency of evidence, the robustness
                of methodologies, and the level of agreement among experts.
              </p>
              <p>
                <br />
                <strong className="text-center">SSP</strong>
                <br />
                Socioeconomic Pathway (SSP) is a future scenario that considers
                climate change and socio-economic global changes (natural
                resources, population growth). SSPs range from optimistic to
                pessimistic scenarios: in SSP119, it is assumed that society
                will be taking "the green road" towards a more sustainable
                planet; while in SSP585 a complete fossil-fueled development is
                considered. The definition of the five Shared Socioeconomic
                Pathway (SSP) scenarios used to develop the IPCC AR 6 sea level
                rise projections applied in this service are described below.
                <br />
                <ul>
                  <li className="mt-5">
                    <strong>SSP119</strong>: holds warming to approximately
                    1.5°C above 1850-1900 in 2100 after slight overshoot
                    (median) and implies net zero CO2 emissions around the
                    middle of the century.
                  </li>
                  <br />
                  <li>
                    <strong>SSP126</strong>: stays below 2.0°C warming relative
                    to 1850-1900 (median) with implied net zero emissions in the
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
                    although more countries adopted 2050 net zero targets in
                    line with SSP119 or SSP126. The SSP245 scenario deviates
                    mildly from a 'no-additional- climate-policy' reference
                    scenario, resulting in a best-estimate warming around 2.7°C
                    by the end of the 21st century relative to 1850-1900.
                  </li>
                  <br />
                  <li>
                    <strong>SSP370</strong>: is a medium to high reference
                    scenario resulting from no additional climate policy under
                    the SSP3 socioeconomic development narrative. SSP370 has
                    particularly high non-CO2 emissions, including high aerosols
                    emissions.
                  </li>
                  <br />
                  <li>
                    <strong>SSP585</strong>: is a high reference scenario with
                    no additional climate policy. Emission levels as high as
                    SSP585 are not obtained by Integrated Assessment Models
                    (IAMs) under any of the SSPs other than the fossil fueled
                    SSP5 socioeconomic development pathway.
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
                level during a storm measured as the height of the water above
                the normal predicted astronomical tide. For this study we
                consider storm surge heights between 0 (none) and 5 metres.
              </p>
            </div>
          </Modal>
        )}
    </>
  );
};

export default Drawer;