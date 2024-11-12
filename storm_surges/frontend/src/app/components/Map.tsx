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
    [-85.05112878, -180.0], // Southwest coordinates
    [85.05112878, 180.0] // Northeast coordinates
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

  const formatCoordinates = (leafletLatLngs: L.LatLng[][]): number[][][] => {
    return leafletLatLngs.map((ring) => {
      let coordinates = ring.map((coord) => [coord.lng, coord.lat]);

      // Calculate signed area using shoelace formula
      let area = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
        area +=
          (coordinates[i + 1][0] - coordinates[i][0]) *
          (coordinates[i + 1][1] + coordinates[i][1]);
      }

      // If area is negative, it's already counter-clockwise
      // If area is positive, it's clockwise and needs to be reversed
      if (area > 0) {
        coordinates = coordinates.reverse();
      }

      // Ensure the polygon is closed
      if (
        coordinates.length > 0 &&
        (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
          coordinates[0][1] !== coordinates[coordinates.length - 1][1])
      ) {
        coordinates.push([...coordinates[0]]);
      }

      // Add debug logging
      console.log("Area calculated:", area);
      console.log(
        "Coordinates orientation:",
        area > 0 ? "clockwise" : "counter-clockwise"
      );

      return coordinates;
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
      }, 200); // delay to show the open button after closing the drawer
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
    setShowLegend((prev) => !prev); // Toggle the visibility of the legend
  };

  const basePath = process.env.BASEPATH || "";

  const memoizedToggleDrawer = useCallback(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      setShowOpenButton(false);
      setTimeout(() => {
        setShowOpenButton(true);
      }, 200);
    } else {
      setIsDrawerOpen(true);
    }
  }, [isDrawerOpen]);

  const memoizedHandleConfidenceChange = useCallback((level: string) => {
    setConfidenceLevel(level);
    setSelectedSSP("");
    setShowOverlayLayer(false);
  }, []);

  const memoizedHandleStormSurgeChange = useCallback((value: number) => {
    setStormSurge(value);
    setShowOverlayLayer(false);
  }, []);

  const memoizedHandleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
    setShowOverlayLayer(false);
  }, []);

  // Memoize the params object for the CachedWMSLayer
  const wmsParams = useMemo(
    () => ({
      time: `${selectedYear}-12-31T00:00:00Z,${selectedYear}-12-31T23:59:59Z`,
      bbox: "44.20,11.73,45.94,14.18",
      token: "bf12d6193efa667283ee9643951acfaa",
      ssp: selectedSSP,
      confidence: confidenceLevel.toLowerCase(),
      stormSurge: formatStormSurge(stormSurge),
    }),
    [selectedYear, selectedSSP, confidenceLevel, stormSurge]
  );

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

  const fetchAreaData = async (payload: AreaRequestPayload) => {
    try {
      setIsLoading(true);
      setApiError(null);

      console.log("Sending API request with payload:", {
        ...payload,
        ssp: selectedSSP || "ssp126",
        confidence: confidenceLevel.toLowerCase(),
        storm_surge: formatStormSurge(stormSurge),
        year: parseInt(selectedYear),
      });

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
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCreated = (e: any) => {
    const { layer } = e;

    // Log raw coordinates from Leaflet
    console.log("Raw Leaflet coordinates:", layer.getLatLngs());

    // Get coordinates from the drawn polygon
    const leafletCoords = layer.getLatLngs();

    // Format coordinates for the API
    const formattedCoords = formatCoordinates(leafletCoords);
    console.log("Formatted coordinates:", formattedCoords);

    // Create the API payload
    const payload = createApiPayload(formattedCoords);
    console.log("Final API payload:", payload);

    // Make the API call
    fetchAreaData(payload);
  };

  return (
    <div className="relative flex-1">
      <style>{customDrawControlStyles}</style>
      <LoadingIndicator isLoading={isLoading} />
      <Drawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={memoizedToggleDrawer}
        handleConfidenceChange={memoizedHandleConfidenceChange}
        handleStormSurgeChange={memoizedHandleStormSurgeChange}
        handleYearChange={memoizedHandleYearChange}
        confidenceLevel={confidenceLevel}
        selectedSSP={selectedSSP}
        setSelectedSSP={setSelectedSSP}
        selectedYear={selectedYear}
        stormSurge={stormSurge}
        isLoading={isLoading}
        toggleOverlayLayer={toggleOverlayLayer}
      />
      <div>
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
              src={basePath + "/drawerArrow.svg"}
              alt="Open Drawer"
              width="21"
              height="21"
            />
          </button>
        )}
      </div>
      <MapContainer
        center={center}
        zoom={5.2795}
        maxZoom={19}
        minZoom={3}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
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
            params={wmsParams}
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
                rectangle: false,
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
                  icon: new L.DivIcon({
                    iconSize: new L.Point(8, 8),
                    className: "leaflet-div-icon leaflet-editing-icon",
                  }),
                  guidelineDistance: 10,
                  showLength: true,
                  metric: true,
                  feet: false,
                  vertices: {
                    radius: 3,
                    weight: 1,
                    color: "#97009c",
                    fillColor: "#ffffff",
                    fillOpacity: 1,
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
          textAlign: "center",
          cursor: "pointer",
          marginTop: "5px",
          right: "10px",
          position: "absolute",
          top: "80px", // Position this button 10px from the top
        }}
      >
        <Image
          src={basePath + "/layerIcon.svg"}
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
          textAlign: "center",
          cursor: "pointer",
          marginTop: "125px",
          right: "10px",
          position: "absolute",
          top: "0px",
        }}
      >
        <Image
          src={basePath + "/polygon.svg"}
          alt="Draw Polygon"
          width="21"
          height="21"
        />
      </button>

      {/* Additional Button Below */}
      <button
        className="leaflet-control-custom"
        onClick={toggleLegend} // Change the handler if needed
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "5px",
          right: "10px",
          position: "absolute",
          top: "160px",
        }}
      >
        <Image src={basePath + "/info.svg"} alt="Info" width="21" height="21" />
      </button>
      {/* Legend window */}
      {showLegend && (
        <div
          style={{
            position: "absolute",
            top: "125px", // Same top as the button
            right: "45px", // Positioned to the left of the button
            background: "white",
            border: "1px solid black",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 9999, // Ensure it appears above other elements
            width: "200px", // Adjust size as needed
            fontSize: "14px",
            color: "black",
            opacity: "70%",
          }}
        >
          {/* Legend content */}
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
                backgroundColor: "#78F773", // Green square
                marginRight: "10px",
              }}
            ></div>
            <span>
              Protected areas <br></br>(2020 baseline)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#F67769", // Red square
                marginRight: "10px",
              }}
            ></div>
            <span>Areas at risk of flood</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;