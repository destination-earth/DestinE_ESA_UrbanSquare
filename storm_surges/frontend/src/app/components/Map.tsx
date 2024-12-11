"use client";

import { useEffect, useState, useRef } from "react";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import L, { LatLngExpression, LatLngBounds } from "leaflet";
import Drawer from "./Drawer";
import LoadingIndicator from "./LoadingIndicator";
import Image from "next/image";
import CachedWMSLayer from "./CachedWMSLayer";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Modal from "./Modal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const customDrawControlStyles = `
  .leaflet-draw-toolbar {
    margin-top: 0;
  }
  .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
    margin-right: 50px;
  }
  .leaflet-draw-toolbar .leaflet-draw-edit-edit,
  .leaflet-draw-toolbar .leaflet-draw-edit-remove {
    margin-right: 50px;
  }
`;

interface AreaRequestPayload {
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  ssp: string;
  confidence: string;
  storm_surge: string;
  year: number | string;
}

function CoolButton({
  isChartLoading,
  onClick,
}: {
  isChartLoading: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle: React.CSSProperties = {
    backgroundColor: isChartLoading ? "#999" : "#F76501",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "7px 13px",
    cursor: isChartLoading ? "not-allowed" : "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  };

  const hoverStyle: React.CSSProperties =
    isHovered && !isChartLoading
      ? {
          transform: "scale(1.05)",
          boxShadow: "0 4px 10px rgba(247,101,1,0.4)",
        }
      : {};

  const activeStyle: React.CSSProperties =
    isActive && !isChartLoading
      ? {
          transform: "scale(0.95)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }
      : {};

  const combinedStyle = {
    ...baseStyle,
    ...hoverStyle,
    ...activeStyle,
  };

  const handleClick = () => {
    if (!isChartLoading) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 100);
      onClick();
    }
  };

  return (
    <button
      style={combinedStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isChartLoading}
    >
      Generate
    </button>
  );
}

const Map = () => {
  const center: LatLngExpression = [48.1074, 13.2275];
  const bounds: LatLngBounds = new LatLngBounds(
    [-85.05112878, -180.0],
    [85.05112878, 180.0]
  );
  const [useDefaultLayer, setUseDefaultLayer] = useState(true);
  const [showOverlayLayer, setShowOverlayLayer] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOpenButton, setShowOpenButton] = useState(true);
  const [confidenceLevel, setConfidenceLevel] = useState("Medium");
  const [selectedSSP, setSelectedSSP] = useState<string | null>("ssp126");
  const [selectedYear, setSelectedYear] = useState("2150");
  const [stormSurge, setStormSurge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  // Track if the analysis is complete
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Chart related states
  const [selectedOption, setSelectedOption] = useState("ssp");
  const [displayedOption, setDisplayedOption] =
    useState<string>(selectedOption);

  const [drawnPolygons, setDrawnPolygons] = useState<number[][][][]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // Modal states for info icons
  const [isExposureModalOpen, setIsExposureModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);

  // Refs for charts to enable downloading
  const populationRef = useRef<any>(null);
  const urbanRef = useRef<any>(null);
  const cerealsRef = useRef<any>(null);

  const formatCoordinates = (leafletLatLngs: L.LatLng[][]): number[][][] => {
    return leafletLatLngs.map((ring) => {
      let coordinates = ring.map((coord) => [coord.lng, coord.lat]);
      const minLng = Math.min(...coordinates.map((point) => point[0]));
      const maxLng = Math.max(...coordinates.map((point) => point[0]));
      const minLat = Math.min(...coordinates.map((point) => point[1]));
      const maxLat = Math.max(...coordinates.map((point) => point[1]));

      coordinates = [
        [minLng, minLat],
        [maxLng, minLat],
        [maxLng, maxLat],
        [minLng, maxLat],
        [minLng, minLat],
      ];
      return coordinates;
    });
  };

  const toggleLayer = () => setUseDefaultLayer(!useDefaultLayer);

  const toggleOverlayLayer = () => {
    setIsLoading(true);
    setShowOverlayLayer((prev) => {
      if (!prev) setIsLoading(true);
      return !prev;
    });
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      setShowOpenButton(false);
      setTimeout(() => {
        setShowOpenButton(true);
      }, 200);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const formatStormSurge = (value: number): string => {
    const integerPart = Math.floor(value / 10);
    const decimalPart = (value % 10) / 10;
    return `${integerPart}_${decimalPart * 10}`;
  };

  useEffect(() => {
    if (!showOverlayLayer) {
      setIsLoading(false);
    }
  }, [showOverlayLayer]);

  // Reset analysisComplete when parameters change or polygon changes
  useEffect(() => {
    setAnalysisComplete(false);
  }, [selectedSSP, confidenceLevel, stormSurge, selectedYear, drawnPolygons]);

  const toggleLegend = () => setShowLegend((prev) => !prev);

  const basePath = process.env.BASEPATH || "";

  const createApiPayload = (coordinates: number[][][]): AreaRequestPayload => {
    return {
      geometry: {
        type: "Polygon",
        coordinates: coordinates,
      },
      ssp: selectedSSP || "ssp126",
      confidence: confidenceLevel.toLowerCase(),
      storm_surge: formatStormSurge(stormSurge),
      year: parseInt(selectedYear),
    };
  };

  const fetchAreaData = async (formattedCoords: number[][][]) => {
    try {
      const apiUrl = `${basePath}/api/area`;
      const payload = createApiPayload(formattedCoords);
      setIsAnalysisLoading(true);
      setApiError(null);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setApiResponse(data);
      setHasFetchedData(true);
      setAnalysisComplete(true); // Analysis is now complete
      setIsSideWindowOpen(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleDrawCreated = (e: any) => {
    const { layer } = e;
    const leafletCoords = layer.getLatLngs();
    const formattedCoords = formatCoordinates(leafletCoords);
    // Store polygon, reset analysisComplete
    setDrawnPolygons([formattedCoords]);
    setAnalysisComplete(false);
  };

  // This is the "Run Analysis" or "Open" button logic
  const handleWindowButtonClick = async () => {
    if (!analysisComplete) {
      // If analysis is not complete, we treat this button as "Run Analysis"
      if (drawnPolygons.length === 0) {
        alert("Please draw a polygon first before running the analysis.");
        return;
      }
      if (drawnPolygons.length > 1) {
        alert("Please only draw one polygon at a time for the analysis.");
        return;
      }

      // If exactly one polygon is drawn, fetch area data
      const formattedCoords = drawnPolygons[0];
      await fetchAreaData(formattedCoords);
    } else {
      // If analysis is complete, the button acts as "Open" to reopen the side panel
      if (!apiResponse) {
        alert("No data available. Please run the analysis first.");
        return;
      }
      setIsSideWindowOpen(true);
    }
  };

  const handleGenerate = async () => {
    if (!hasFetchedData) {
      alert("Please run the analysis first before generating charts.");
      return;
    }

    let sspToSend = selectedSSP || "ssp126";
    let stormToSend = formatStormSurge(stormSurge);
    let yearToSend: number | string = parseInt(selectedYear);

    if (selectedOption === "ssp") {
      sspToSend = "all";
    } else if (selectedOption === "storm") {
      stormToSend = "all";
    } else if (selectedOption === "years") {
      yearToSend = "all";
    }

    try {
      setIsChartLoading(true);
      const apiUrl = `${basePath}/api/chartApi`;
      const payload = {
        geometry: {
          type: "Polygon",
          coordinates: drawnPolygons[0], // the single polygon
        },
        ssp: sspToSend,
        confidence: confidenceLevel.toLowerCase(),
        storm_surge: stormToSend,
        year: yearToSend,
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Response from /chartApi:", data);
      setChartData(data);
      setDisplayedOption(selectedOption);
    } catch (err) {
      console.error("Error calling /chartApi:", err);
    } finally {
      setIsChartLoading(false);
    }
  };

  const openExposureModal = () => setIsExposureModalOpen(true);
  const closeExposureModal = () => setIsExposureModalOpen(false);

  const openStatModal = () => setIsStatModalOpen(true);
  const closeStatModal = () => setIsStatModalOpen(false);

  const downloadChart = (chartRef: React.RefObject<any>, filename: string) => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const [isHovered, setIsHovered] = useState(false);

  // Decide what the main button text should be: "Run Analysis" if no analysis complete, otherwise "Open"
  const windowButtonText = analysisComplete ? "Open" : "Run Analysis";

  return (
    <div className="relative flex-1">
      <style>{customDrawControlStyles}</style>
      <LoadingIndicator isLoading={isLoading} />
      <Drawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        handleConfidenceChange={(level: string) => setConfidenceLevel(level)}
        handleStormSurgeChange={(value: number) => setStormSurge(value)}
        handleYearChange={(year: string) => setSelectedYear(year)}
        confidenceLevel={confidenceLevel}
        selectedSSP={selectedSSP}
        setSelectedSSP={setSelectedSSP}
        selectedYear={selectedYear}
        stormSurge={stormSurge}
        isLoading={isLoading}
        toggleOverlayLayer={toggleOverlayLayer}
      />
      {showOpenButton && (
        <button
          onClick={toggleDrawer}
          style={{
            position: "absolute",
            left: isDrawerOpen ? "254.5px" : "0",
            visibility: isDrawerOpen ? "hidden" : "visible",
            top: "75%",
            transform: "translateY(-50%)",
            zIndex: 99999,
            background: "gray",
            border: "1px solid black",
            borderRadius: "0 5px 5px 0",
            paddingTop: "20px",
            paddingBottom: "20px",
            cursor: "pointer",
          }}
        >
          <Image
            src={`${basePath}/drawerArrow.svg`}
            alt="Open Drawer"
            width="21"
            height="21"
          />
        </button>
      )}

      <MapContainer
        center={center}
        zoom={5.2795}
        maxZoom={19}
        minZoom={3}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
        maxBounds={bounds}
        preferCanvas={true}
      >
        {useDefaultLayer ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={20}
          />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}
        {showOverlayLayer && (
          <CachedWMSLayer
            url="https://hulk.adamplatform.eu/wmts?"
            layers="InundationMap"
            styles="InundationMap;colorrange=(0,2);nodata=2"
            format="image/png"
            transparent={false}
            version="1.3.0"
            opacity={0.5}
            crs={L.CRS.EPSG4326}
            params={{
              time: `${selectedYear}-12-31T00:00:00Z,${selectedYear}-12-31T23:59:59Z`,
              bbox: "44.20,11.73,45.94,14.18",
              token: "bf12d6193efa667283ee9643951acfaa",
              ssp: selectedSSP,
              confidence: confidenceLevel.toLowerCase(),
              stormSurge: formatStormSurge(stormSurge),
            }}
            onLoading={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
        )}
        <FeatureGroup>
          {isDrawingMode && (
            <EditControl
              position="topright"
              onCreated={handleDrawCreated}
              draw={{
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: "#e1e100",
                    message: "<strong>Cannot draw intersecting lines!</strong>",
                  },
                  shapeOptions: {
                    color: "#97009c",
                    fillOpacity: 0.2,
                    weight: 2,
                  },
                },
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>

      {/* Toggle layer, polygon drawing, and legend buttons unchanged */}
      <button
        className="leaflet-control-custom"
        onClick={toggleLayer}
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          cursor: "pointer",
          marginTop: "5px",
          position: "absolute",
          top: "80px",
          right: "10px",
        }}
      >
        <Image
          src={`${basePath}/layerIcon.svg`}
          alt="Toggle Layer"
          width="21"
          height="21"
        />
      </button>
      <button
        className="leaflet-control-custom"
        onClick={() => setIsDrawingMode(!isDrawingMode)}
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          cursor: "pointer",
          marginTop: "125px",
          position: "absolute",
          top: "0px",
          right: "10px",
        }}
      >
        <Image
          src={`${basePath}/polygon.svg`}
          alt="Draw Polygon"
          width="21"
          height="21"
        />
      </button>
      <button
        className="leaflet-control-custom"
        onClick={toggleLegend}
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          cursor: "pointer",
          marginTop: "5px",
          position: "absolute",
          top: "160px",
          right: "10px",
        }}
      >
        <Image src={`${basePath}/info.svg`} alt="Info" width="21" height="21" />
      </button>

      {/* This button now toggles between "Run Analysis" and "Open" */}
      <button
        onClick={handleWindowButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="leaflet-control-custom"
        style={{
          position: "fixed",
          top: "270px",
          right: "10px",
          background: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          cursor: isAnalysisLoading ? "wait" : "pointer", // Cursor indicates loading
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          transition: "width 0.3s ease, padding 0.3s ease",
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: isHovered ? "120px" : "40px",
          justifyContent: isHovered ? "flex-start" : "center",
        }}
      >
        <Image
          src={`${basePath}/chartWindow.svg`}
          alt="Chart Window"
          width="21"
          height="21"
        />
        {/* If hovered, show text */}
        {isHovered && (
          <span
            style={{ marginLeft: "5px", fontSize: "13px", fontWeight: "bold" }}
          >
            {windowButtonText}
          </span>
        )}
        {/* If analysis is not complete and loading is true, show a small spinner */}
        {!analysisComplete && isAnalysisLoading && (
          <div
            style={{
              marginLeft: "5px",
              width: "16px",
              height: "16px",
              border: "2px solid #ff8400",
              borderTop: "2px solid #FDD900",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </button>

      {showLegend && (
        <div
          style={{
            position: "absolute",
            top: "125px",
            right: "45px",
            background: "white",
            border: "1px solid black",
            borderRadius: "5px",
            padding: "10px",
            zIndex: 9999,
            color: "black",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#78F773",
                marginRight: "10px",
              }}
            ></div>
            <span>Protected areas (2020 baseline)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#F67769",
                marginRight: "10px",
              }}
            ></div>
            <span>Areas at risk of flood</span>
          </div>
        </div>
      )}

      {isSideWindowOpen ? (
        <div className="responsive-sidebar">
          <style jsx>{`
            .responsive-sidebar {
              position: fixed;
              top: 60px;
              bottom: 36.1667px;
              right: 0;
              width: 25vw;
              background-color: #0d1527;
              box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
              z-index: 1000;
              padding: 20px;
              overflow-y: auto;
              color: white;
              border-left: 3px solid transparent;
              border-image: linear-gradient(to bottom, #f76501, yellow) 1;
              font-size: 14px;
            }

            @media (max-width: 600px) {
              .responsive-sidebar {
                width: 100vw;
                left: 0;
                right: 0;
                bottom: 0;
                top: auto;
                height: 40vh;
                border-left: none;
                border-top: 3px solid transparent;
                border-image: linear-gradient(to right, #f76501, yellow) 1;
              }
            }
          `}</style>
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
            onClick={() => setIsSideWindowOpen(false)}
          >
            ✖
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                margin: "0",
                padding: "0",
                fontSize: "18px",
                fontWeight: "bold",
                marginRight: "5px",
              }}
            >
              Exposure Assessment
            </h3>
            <Image
              src={`${basePath}/infoWhite.svg`}
              alt="Info"
              width="16"
              height="16"
              style={{ cursor: "pointer" }}
              onClick={openExposureModal}
            />
          </div>

          {apiResponse ? (
            <div className="mt-6">
              {Object.entries(apiResponse).map(([key, value]) => {
                const readableLabels: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "Population",
                  GHS_BUILT_S_E2020_GLOBE: "Urban Area Extent",
                  cereals: "Cultivated Area Extent",
                };

                const units: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "",
                  GHS_BUILT_S_E2020_GLOBE: "m²",
                  cereals: "ha",
                };

                const icons: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: `${basePath}/people.svg`,
                  GHS_BUILT_S_E2020_GLOBE: `${basePath}/building.svg`,
                  cereals: `${basePath}/wheat2.svg`,
                };

                const label = readableLabels[key] || key;
                const unit = units[key] || "";
                const iconPath = icons[key];

                return (
                  <div
                    key={key}
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {iconPath && (
                      <Image
                        src={iconPath}
                        alt={`${label} icon`}
                        width={24}
                        height={24}
                        style={{ marginRight: "10px" }}
                      />
                    )}
                    <strong>{label}</strong>: {` ${String(value)}`} {unit}
                  </div>
                );
              })}
              <div
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#1A2238",
                  borderRadius: "5px",
                  padding: "10px",
                  textAlign: "center",
                  position: "relative",
                  minHeight: "50px",
                  paddingBottom: "30px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4
                    style={{
                      color: "white",
                      margin: "0",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginRight: "5px",
                    }}
                  >
                    Statistical Analysis
                  </h4>
                  <Image
                    src={`${basePath}/infoWhite.svg`}
                    alt="Info"
                    width="16"
                    height="16"
                    style={{ cursor: "pointer" }}
                    onClick={openStatModal}
                  />
                </div>
                <p
                  style={{
                    color: "#ccc",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  Select variable of interest
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <label
                        style={{
                          color: "white",
                          cursor: isChartLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="chartOption"
                          value="ssp"
                          style={{ marginRight: "5px" }}
                          checked={selectedOption === "ssp"}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          disabled={isChartLoading}
                        />
                        SSP
                      </label>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <label
                        style={{
                          color: "white",
                          cursor: isChartLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="chartOption"
                          value="storm"
                          style={{ marginRight: "5px" }}
                          checked={selectedOption === "storm"}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          disabled={isChartLoading}
                        />
                        Storm Surge
                      </label>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <label
                        style={{
                          color: "white",
                          cursor: isChartLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="chartOption"
                          value="years"
                          style={{ marginRight: "5px" }}
                          checked={selectedOption === "years"}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          disabled={isChartLoading}
                        />
                        Year
                      </label>
                    </div>
                  </div>
                  {/* This is the Generate button inside the panel, unchanged */}
                  <CoolButton
                    isChartLoading={isChartLoading}
                    onClick={handleGenerate}
                  />
                </div>

                {isChartLoading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "white",
                      margin: "20px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        width: "40px",
                        height: "40px",
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #F76501",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                    <p style={{ marginTop: "10px", fontSize: "14px" }}>
                      Loading charts...
                    </p>
                  </div>
                ) : (
                  chartData &&
                  chartData.length > 0 &&
                  (() => {
                    let labels: string[] = [];
                    let popValues: number[] = [];
                    let urbanValues: number[] = [];
                    let cerealsValues: number[] = [];

                    chartData.forEach((item: any) => {
                      let labelValue = "";
                      if (displayedOption === "ssp") {
                        labelValue = item.ssp;
                      } else if (displayedOption === "storm") {
                        labelValue = item.storm_surge;
                      } else if (displayedOption === "years") {
                        labelValue = String(item.year);
                      }

                      labels.push(labelValue);
                      popValues.push(item.result.GHS_POP_E2020_GLOBE);
                      urbanValues.push(item.result.GHS_BUILT_S_E2020_GLOBE);
                      cerealsValues.push(item.result.cereals);
                    });

                    const baseChartOptions = {
                      responsive: true,
                      plugins: {
                        legend: { labels: { color: "white" } },
                        title: { display: false, color: "white" },
                      },
                      scales: {
                        x: {
                          ticks: { color: "white" },
                          grid: { color: "#555" },
                        },
                        y: {
                          ticks: { color: "white" },
                          grid: { color: "#555" },
                        },
                      },
                    };

                    const populationData = {
                      labels,
                      datasets: [
                        {
                          label: "Population affected",
                          data: popValues,
                          backgroundColor: "#ED7D31",
                        },
                      ],
                    };

                    const urbanData = {
                      labels,
                      datasets: [
                        {
                          label: "Urban area affected (m²)",
                          data: urbanValues,
                          backgroundColor: "#4472C4",
                        },
                      ],
                    };

                    const cerealsData = {
                      labels,
                      datasets: [
                        {
                          label: "Agricultural area affected (ha)",
                          data: cerealsValues,
                          backgroundColor: "#70AD47",
                        },
                      ],
                    };

                    return (
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ marginBottom: "30px" }}>
                          <Bar
                            ref={populationRef}
                            data={populationData}
                            options={baseChartOptions}
                          />
                          <button
                            style={{
                              marginTop: "5px",
                              backgroundColor: "#333",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              downloadChart(
                                populationRef,
                                "population_chart.png"
                              )
                            }
                          >
                            Download Population Chart
                          </button>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                          <Bar
                            ref={urbanRef}
                            data={urbanData}
                            options={baseChartOptions}
                          />
                          <button
                            style={{
                              marginTop: "5px",
                              backgroundColor: "#333",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              downloadChart(urbanRef, "urban_chart.png")
                            }
                          >
                            Download Urban Chart
                          </button>
                        </div>

                        <div>
                          <Bar
                            ref={cerealsRef}
                            data={cerealsData}
                            options={baseChartOptions}
                          />
                          <button
                            style={{
                              marginTop: "5px",
                              backgroundColor: "#333",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              downloadChart(cerealsRef, "cereals_chart.png")
                            }
                          >
                            Download Agricultural Chart
                          </button>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : null}

      {isExposureModalOpen && (
        <Modal onClose={closeExposureModal}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <h3 style={{ marginTop: 0, fontWeight: "bold" }}>
              Exposure Assessment
            </h3>
            <br />
            <p>
              The exposure assessment is generated after you draw a polygon and
              run the analysis.
            </p>
          </div>
        </Modal>
      )}

      {isStatModalOpen && (
        <Modal onClose={closeStatModal}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <h3 style={{ marginTop: 0, fontWeight: "bold" }}>
              Statistical Analysis
            </h3>
            <br />
            <p>
              The statistical analysis allows you to generate charts after
              running the analysis.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Map;
