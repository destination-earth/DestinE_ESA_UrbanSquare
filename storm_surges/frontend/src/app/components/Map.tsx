"use client";

import { WMSTileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngBounds } from "leaflet";
import L from "leaflet";
import Drawer from "./Drawer";
import LoadingIndicator from "./LoadingIndicator";
import Image from "next/image";

// Cache object for storing tile URLs
const tileCache: Record<string, { url: string; timestamp: number }> = {};

const cacheExpiry = 5 * 60 * 1000; // Cache expiry time set to 5 minutes

const Map = () => {
  const center: LatLngExpression = [48.1074, 13.2275];
  const bounds: LatLngBounds = new LatLngBounds(
    [-85.05112878, -180.0], // Southwest coordinates
    [85.05112878, 180.0] // Northeast coordinates
  );
  const [useDefaultLayer, setUseDefaultLayer] = useState(true);
  const [showOverlayLayer, setShowOverlayLayer] = useState(false);
  const [isCursorOnMap, setIsCursorOnMap] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOpenButton, setShowOpenButton] = useState(true);
  const [confidenceLevel, setConfidenceLevel] = useState("Medium");
  const [selectedSSP, setSelectedSSP] = useState<string | null>("ssp126");
  const [selectedYear, setSelectedYear] = useState("2150");
  const [stormSurge, setStormSurge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Function to cache and retrieve tile URLs
  const getCachedTileUrl = (
    url: string,
    zoom: number,
    tileCoords: { x: number; y: number }
  ) => {
    const cacheKey = `${zoom}-${tileCoords.x}-${tileCoords.y}`;
    const now = Date.now();

    // If the tile is cached and has not expired, return the cached tile
    if (
      tileCache[cacheKey] &&
      now - tileCache[cacheKey].timestamp < cacheExpiry
    ) {
      return tileCache[cacheKey].url;
    }

    // Otherwise, cache the tile and return its URL
    const tileUrl = `${url}&z=${zoom}&x=${tileCoords.x}&y=${tileCoords.y}`;
    tileCache[cacheKey] = { url: tileUrl, timestamp: now };
    return tileUrl;
  };

  const buildWMSUrl = (tileCoords: { x: number; y: number }, zoom: number) => {
    const baseUrl = "https://hulk.adamplatform.eu/wmts?";
    const params = new URLSearchParams({
      layers: "InundationMap",
      styles: "InundationMap;colorrange=(0,2);nodata=2",
      format: "image/png",
      transparent: "false",
      version: "1.3.0",
      time: `${selectedYear}-12-31T00:00:00Z,${selectedYear}-12-31T23:59:59Z`,
      bbox: "44.20,11.73,45.94,14.18",
      token: "bf12d6193efa667283ee9643951acfaa",
      ssp: selectedSSP!,
      confidence: confidenceLevel.toLowerCase(),
      stormSurge: formatStormSurge(stormSurge),
    });

    // Use the caching logic
    return getCachedTileUrl(baseUrl + params.toString(), zoom, tileCoords);
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

  const handleConfidenceChange = (level: string) => {
    setConfidenceLevel(level);
    setSelectedSSP("");
    setShowOverlayLayer(false);
  };

  const handleStormSurgeChange = (value: number) => {
    setStormSurge(value);
    setShowOverlayLayer(false);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setShowOverlayLayer(false);
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

  return (
    <div className="relative flex-1">
      <LoadingIndicator isLoading={isLoading} />
      <Drawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        handleConfidenceChange={handleConfidenceChange}
        handleStormSurgeChange={handleStormSurgeChange}
        handleYearChange={handleYearChange}
        confidenceLevel={confidenceLevel}
        selectedSSP={selectedSSP}
        setSelectedSSP={setSelectedSSP} // Pass the setter function
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
          <WMSTileLayer
            url="https://hulk.adamplatform.eu/wmts?"
            layers="InundationMap"
            styles="InundationMap;colorrange=(0,2);nodata=2"
            format="image/png"
            transparent={false}
            version="1.3.0"
            crs={L.CRS.EPSG4326}
            opacity={0.5}
            params={
              {
                time: `${selectedYear}-12-31T00:00:00Z,${selectedYear}-12-31T23:59:59Z`,
                bbox: "44.20,11.73,45.94,14.18",
                token: "bf12d6193efa667283ee9643951acfaa",
                ssp: selectedSSP,
                confidence: confidenceLevel.toLowerCase(),
                stormSurge: formatStormSurge(stormSurge),
              } as any
            }
            eventHandlers={{
              loading: () => setIsLoading(true),
              load: () => setIsLoading(false),
            }}
          />
        )}
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
          top: "120px",
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
            opacity: '70%',
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
            <span>Protected areas <br></br>(2020 baseline)</span>
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

      {/* {isCursorOnMap && (
        <div
          style={{
            position: "absolute",
            bottom: "2px",
            right: "6px",
            zIndex: 1000,
            padding: "2px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid black",
            borderRadius: "5px",
            color: "black",
            fontSize: "12px",
          }}
        ></div>
      )} */}
    </div>
  );
};

export default Map;
