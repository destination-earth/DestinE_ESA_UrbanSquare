"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import L, { LatLngExpression, LatLngBounds } from "leaflet";
import Drawer from "./Drawer";
import LoadingIndicator from "./LoadingIndicator";
import Image from "next/image";
import CachedWMSLayer from "./CachedWMSLayer";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";

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
  year: number;
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
  const [showLegend, setShowLegend] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const formatCoordinates = (leafletLatLngs: L.LatLng[][]): number[][][] => {
    return leafletLatLngs.map((ring) => {
      // Ensure correct [lng, lat] format
      let coordinates = ring.map((coord) => [coord.lng, coord.lat]);

      console.log(
        "Initial coordinates (lng, lat):",
        JSON.stringify(coordinates)
      );

      // Find min/max bounds
      const minLng = Math.min(...coordinates.map((point) => point[0])); // Min longitude
      const maxLng = Math.max(...coordinates.map((point) => point[0])); // Max longitude
      const minLat = Math.min(...coordinates.map((point) => point[1])); // Min latitude
      const maxLat = Math.max(...coordinates.map((point) => point[1])); // Max latitude

      // Reorder points: Bottom-left → Bottom-right → Top-right → Top-left → Bottom-left
      coordinates = [
        [minLng, minLat], // Bottom-left
        [maxLng, minLat], // Bottom-right
        [maxLng, maxLat], // Top-right
        [minLng, maxLat], // Top-left
        [minLng, minLat], // Close the polygon (Bottom-left)
      ];

      console.log(
        "Reordered coordinates (rectangular format):",
        JSON.stringify(coordinates)
      );

      return coordinates; // Return as a single array (number[][])
    });
  };

  const toggleLayer = () => {
    setUseDefaultLayer(!useDefaultLayer);
  };

  const toggleOverlayLayer = () => {
    setIsLoading(true);
    setShowOverlayLayer((prev) => {
      if (!prev) {
        setIsLoading(true);
      }
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

  const toggleLegend = () => {
    setShowLegend((prev) => !prev);
  };

  const basePath = process.env.BASEPATH || "";

  // const memoizedToggleDrawer = useCallback(() => {
  //   if (isDrawerOpen) {
  //     setIsDrawerOpen(false);
  //     setShowOpenButton(false);
  //     setTimeout(() => {
  //       setShowOpenButton(true);
  //     }, 200);
  //   } else {
  //     setIsDrawerOpen(true);
  //   }
  // }, [isDrawerOpen]);

  // const memoizedHandleConfidenceChange = useCallback((level: string) => {
  //   setConfidenceLevel(level);
  //   setSelectedSSP("");
  //   setShowOverlayLayer(false);
  // }, []);

  // const memoizedHandleStormSurgeChange = useCallback((value: number) => {
  //   setStormSurge(value);
  //   setShowOverlayLayer(false);
  // }, []);

  // const memoizedHandleYearChange = useCallback((year: string) => {
  //   setSelectedYear(year);
  //   setShowOverlayLayer(false);
  // }, []);

  // const wmsParams = useMemo(
  //   () => ({
  //     time: `${selectedYear}-12-31T00:00:00Z,${selectedYear}-12-31T23:59:59Z`,
  //     bbox: "44.20,11.73,45.94,14.18",
  //     token: "bf12d6193efa667283ee9643951acfaa",
  //     ssp: selectedSSP,
  //     confidence: confidenceLevel.toLowerCase(),
  //     stormSurge: formatStormSurge(stormSurge),
  //   }),
  //   [selectedYear, selectedSSP, confidenceLevel, stormSurge]
  // );

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
      const payload = createApiPayload(formattedCoords);
      setIsLoading(true);
      setApiError(null);

      console.log("Final API payload:", payload);

      const response = await fetch("/api/area", {
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
      setIsSideWindowOpen(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCreated = (e: any) => {
    const { layer } = e;

    console.log("Raw Leaflet coordinates:", layer.getLatLngs());

    const leafletCoords = layer.getLatLngs();
    const formattedCoords = formatCoordinates(leafletCoords);
    console.log("Formatted coordinates:", formattedCoords);

    fetchAreaData(formattedCoords);
  };

  const toggleSideWindow = () => {
    if (hasFetchedData) {
      setIsSideWindowOpen((prev) => !prev); // Toggle visibility only if data has been fetched
    }
  };

  const closeSideWindow = () => {
    setIsSideWindowOpen(false);
  };

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
                // rectangle: false,
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
        <div
          style={{
            position: "fixed",
            top: "60px",
            bottom: "36.1667px",
            right: 0,
            width: "25%",
            backgroundColor: "#0D1527",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            padding: "20px",
            overflowY: "auto",
            color: "white",
            borderLeft: "3px solid transparent", // Reserve space for gradient border
            borderImage: "linear-gradient(to bottom, #F76501, yellow) 1", // Gradient border
            fontSize: "14px",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              // background: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
            onClick={toggleSideWindow}
          >
            ✖
          </button>
          <h3
            style={{
              textAlign: "center", // Center the text horizontally
              margin: "0 0 20px 0", // Adjust margin to space it nicely below the top
              padding: "0", // Remove any extra padding
              fontSize: "18px", // Set a consistent font size
              fontWeight: "bold", // Use a bold font weight
            }}
          >
            Exposure Assessment
          </h3>

          {apiResponse ? (
            <div className="mt-6">
              {Object.entries(apiResponse).map(([key, value]) => {
                // Define the mapping for human-readable names, units, and icon paths
                const readableLabels: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "Population",
                  GHS_BUILT_S_E2020_GLOBE: "Urban Area Extent",
                  cereals: "Cultivated Area Extent",
                };

                const units: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "", // No unit for population
                  GHS_BUILT_S_E2020_GLOBE: "m²",
                  cereals: "m²",
                };

                const icons: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: `${basePath}/people.svg`,
                  GHS_BUILT_S_E2020_GLOBE: `${basePath}/building.svg`,
                  cereals: `${basePath}/wheat2.svg`,
                };

                const label = readableLabels[key] || key; // Default to the key if no mapping exists
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
                        src={`${basePath}/info.svg`}
                        alt={`${label} icon`}
                        style={{
                          marginRight: "10px",
                          width: "24px", // Set a consistent width
                          height: "24px", // Set a consistent height
                        }}
                      />
                    )}
                    <strong>{label}</strong>: {` ${String(value)}`} {unit}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        apiResponse && (
          <button
            style={{
              position: "fixed",
              top: "270px",
              right: "10px",
              background: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 15px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={toggleSideWindow}
          >
            Open
          </button>
        )
      )}
    </div>
  );
};

export default Map;
