"use client";

import { useEffect, useState, useRef } from "react";
import Select, { MultiValue } from "react-select";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
} from "react-leaflet";
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

type AmenityCategory = "education" | "emergency" | "healthcare" | "power";

const categoryToTags: Record<
  AmenityCategory,
  { key: string; value: string }[]
> = {
  education: [
    { key: "amenity", value: "childcare" },
    { key: "amenity", value: "college" },
    { key: "amenity", value: "kindergarten" },
    { key: "amenity", value: "school" },
    { key: "amenity", value: "university" },
  ],
  emergency: [
    { key: "emergency", value: "ambulance_station" },
    { key: "emergency", value: "assembly_point" },
    { key: "emergency", value: "emergency_ward_entrance" },
    { key: "amenity", value: "fire_station" },
    { key: "amenity", value: "ranger_station" },
  ],
  healthcare: [
    { key: "amenity", value: "clinic" },
    { key: "amenity", value: "hospital" },
  ],
  power: [
    { key: "power", value: "compensator" },
    { key: "power", value: "generator" },
    { key: "power", value: "plant" },
    { key: "man_made", value: "storage_tank" },
  ],
};

interface CategoryOption {
  value: AmenityCategory;
  label: string;
}

// The dropdown label is "Energy Systems" for the category "power"
// and "Healthcare" for "healthcare", etc.
const categoryOptions: CategoryOption[] = [
  { value: "education", label: "Education" },
  { value: "emergency", label: "Emergency Response" },
  { value: "healthcare", label: "Healthcare" },
  { value: "power", label: "Energy Systems" },
];

const reactSelectDarkStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "#2c3e50",
    border: state.isFocused ? "1px solid #f76501" : "1px solid #444",
    boxShadow: "none",
    "&:hover": { border: "1px solid #f76501" },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#2c3e50",
    zIndex: 9999, // ensure dropdown is on top
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#f76501"
      : state.isFocused
      ? "#34495e"
      : "transparent",
    color: "#fff",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#34495e",
    color: "#fff",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#eee",
    ":hover": { backgroundColor: "#f76501", color: "#fff" },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#aaa",
  }),
};

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
  onCancel,
}: {
  isChartLoading: boolean;
  onClick: () => void;
  onCancel: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle: React.CSSProperties = {
    backgroundColor: isChartLoading ? "#f44336" : "#F76501", // Red when loading
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "7px 13px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  };

  const hoverStyle: React.CSSProperties =
    isHovered && !isActive
      ? {
          transform: "scale(1.05)",
          boxShadow: "0 4px 10px rgba(247,101,1,0.4)",
        }
      : {};

  const activeStyle: React.CSSProperties = isActive
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
    if (isChartLoading) {
      onCancel(); // Trigger the cancel behavior
    } else {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 100);
      onClick(); // Trigger the API call
    }
  };

  return (
    <button
      style={combinedStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isChartLoading ? "Cancel" : "Generate"}
    </button>
  );
}

function getCategoryFromTags(
  tags: Record<string, string>
): AmenityCategory | undefined {
  // 1) Education
  const educationValues = [
    "childcare",
    "college",
    "kindergarten",
    "school",
    "university",
  ];
  if (tags.amenity && educationValues.includes(tags.amenity)) {
    return "education";
  }

  // 2) Emergency
  const emergencyAmenityValues = ["fire_station", "ranger_station"];
  const emergencyValues = [
    "ambulance_station",
    "assembly_point",
    "emergency_ward_entrance",
  ];
  if (
    (tags.emergency && emergencyValues.includes(tags.emergency)) ||
    (tags.amenity && emergencyAmenityValues.includes(tags.amenity))
  ) {
    return "emergency";
  }

  // 3) Healthcare
  const healthcareValues = ["clinic", "hospital"];
  if (tags.amenity && healthcareValues.includes(tags.amenity)) {
    return "healthcare";
  }

  // 4) Power
  const powerValues = ["compensator", "generator", "plant"];
  if (
    (tags.power && powerValues.includes(tags.power)) ||
    tags.man_made === "storage_tank"
  ) {
    return "power";
  }

  return undefined; // If not found in any category
}

const categoryColorMap: Record<AmenityCategory, string> = {
  education: "purple",
  emergency: "red",
  healthcare: "green",
  power: "blue",
};

function getMarkerColor(tags: Record<string, string>): string {
  const cat = getCategoryFromTags(tags);
  if (cat) {
    return categoryColorMap[cat];
  }
  // fallback if it doesn't match anything
  return "gray";
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
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Chart states
  const [selectedOption, setSelectedOption] = useState("ssp");
  const [displayedOption, setDisplayedOption] =
    useState<string>(selectedOption);
  const [chartData, setChartData] = useState<any>(null);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // Overpass: chosen categories + fetched data
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [overpassData, setOverpassData] = useState<any>(null);
  const [isOverpassLoading, setIsOverpassLoading] = useState(false);
  const [overpassError, setOverpassError] = useState<string | null>(null);
  const [visibleAmenities, setVisibleAmenities] = useState<
    Record<AmenityCategory, boolean>
  >({
    education: true,
    emergency: true,
    healthcare: true,
    power: true,
  });
  const [showAmenities, setShowAmenities] = useState(false);

  // For polygons drawn
  const [drawnPolygons, setDrawnPolygons] = useState<number[][][][]>([]);

  // Modal states
  const [isExposureModalOpen, setIsExposureModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] =
    useState(false);

  // Abort controllers
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // Refs for chart downloading
  const populationRef = useRef<any>(null);
  const urbanRef = useRef<any>(null);
  const cerealsRef = useRef<any>(null);

  const basePath = process.env.BASEPATH || "";

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

  /* ---------------------------------
     Toggling layers & side UI things
  ----------------------------------- */
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

  const toggleLegend = () => setShowLegend((prev) => !prev);

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

  function buildOverpassTags(cats: CategoryOption[]) {
    const allTags: { key: string; value: string }[] = [];
    cats.forEach((cat) => {
      allTags.push(...categoryToTags[cat.value]);
    });
    return allTags;
  }

  async function handleFetchOverpass() {
    // Ensure a polygon is drawn
    if (drawnPolygons.length === 0) {
      alert("Please draw a polygon first before fetching amenities.");
      return;
    }
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const coords = drawnPolygons[0];
    const tags = buildOverpassTags(selectedCategories);

    try {
      setIsOverpassLoading(true);
      setOverpassError(null);

      const resp = await fetch(`${basePath}/api/overpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geometry: { type: "Polygon", coordinates: coords },
          tags,
        }),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || "Error from Overpass");
      }

      const data = await resp.json();
      // Filter out features that represent rooftop solar panels
      if (data.elements) {
        data.elements = data.elements.filter((el: any) => {
          return !(
            el.tags && el.tags["generator:type"] === "solar_photovoltaic_panel"
          );
        });
      }
      setOverpassData(data);
      console.log("Overpass data:", data);
    } catch (err) {
      console.error(err);
      setOverpassError(
        err instanceof Error ? err.message : "Unknown Overpass error"
      );
    } finally {
      setIsOverpassLoading(false);
    }
  }

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

  const fetchAreaData = async (
    formattedCoords: number[][][],
    controller: AbortController
  ) => {
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
        signal: controller.signal,
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
      setAnalysisComplete(true);
      setIsSideWindowOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Fetch request canceled");
        } else {
          setApiError(error.message);
        }
      } else {
        console.error("An unknown error occurred:", error);
        setApiError("An unknown error occurred.");
      }
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
    if (isAnalysisLoading) {
      // If the API is loading, cancel the request
      abortController?.abort();
      setIsAnalysisLoading(false);
      setAbortController(null);
      return;
    }

    if (!analysisComplete) {
      // Clear charts when starting a new analysis
      setChartData(null);
      // If analysis is not complete, treat this as "Run Analysis"
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
      const controller = new AbortController();
      setAbortController(controller);

      try {
        await fetchAreaData(formattedCoords, controller);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("Fetch request canceled");
          } else {
            console.error("An error occurred:", error.message);
          }
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setAbortController(null);
        setIsAnalysisLoading(false); // Ensure loading stops even if canceled
      }
    } else {
      // If analysis is complete, act as "Open"
      if (!apiResponse) {
        alert("No data available. Please run the analysis first.");
        return;
      }
      setIsSideWindowOpen(true);
    }
  };

  const handleGenerate = async () => {
    if (isChartLoading) {
      // Cancel the API call
      abortController?.abort();
      setAbortController(null);
      setIsChartLoading(false);
      return;
    }

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

    const controller = new AbortController(); // Create an AbortController
    setAbortController(controller); // Store it in state

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
        signal: controller.signal, // Pass the AbortController's signal
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Response from /chartApi:", data);
      setChartData(data);
      setDisplayedOption(selectedOption);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("API call canceled");
      } else {
        console.error("Error calling /chartApi:", err);
      }
    } finally {
      setIsChartLoading(false);
      setAbortController(null);
    }
  };

  // const openExposureModal = () => setIsExposureModalOpen(true);
  // const closeExposureModal = () => setIsExposureModalOpen(false);

  // const openStatModal = () => setIsStatModalOpen(true);
  // const closeStatModal = () => setIsStatModalOpen(false);

  const downloadChart = (chartRef: React.RefObject<any>, filename: string) => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const toggleAmenityVisibility = (category: AmenityCategory) => {
    setVisibleAmenities((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle visibility
    }));
  };

  const [isHovered, setIsHovered] = useState(false);

  const windowButtonText = isAnalysisLoading
    ? "Cancel"
    : analysisComplete
    ? "Open"
    : "Run Analysis";

  return (
    <div className="relative flex-1">
      <style>{customDrawControlStyles}</style>
      <LoadingIndicator isLoading={isLoading} />
      {/* Drawer with your existing props */}
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

      {/* Button to open the drawer if closed */}
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

      {/* Main map container */}
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
        {/* Base tile layer */}
        {useDefaultLayer ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={20}
          />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}

        {/* Optional overlay layer */}
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

        {/* FeatureGroup includes the draw controls & Overpass markers */}
        <FeatureGroup>
          {/* Draw controls */}
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

          {/* Markers for Overpass data */}
          {overpassData?.elements?.map((el: any) => {
            const category = getCategoryFromTags(el.tags || {});
            if (!category || !visibleAmenities[category]) return null; // Hide if toggled off

            const lat = el.type === "node" ? el.lat : el.center?.lat;
            const lon = el.type === "node" ? el.lon : el.center?.lon;
            if (!lat || !lon) return null;

            const name = el.tags?.name || el.tags?.amenity || "Unnamed";
            const color = getMarkerColor(el.tags || {});

            return (
              <CircleMarker
                key={`${el.type}-${el.id}`}
                center={[lat, lon]}
                color={color}
                fillColor={color}
                radius={el.type === "node" ? 6 : 8} // Slightly larger for ways/relations
                fillOpacity={1.0}
              >
                <Popup>
                  <strong>{name}</strong>
                  <br />
                  {Object.entries(el.tags || {}).map(([k, v]) => (
                    <div key={k}>
                      {k}: {String(v)}
                    </div>
                  ))}
                </Popup>
              </CircleMarker>
            );
          })}
        </FeatureGroup>
      </MapContainer>

      {/* Buttons for toggling layer, draw mode, legend */}
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

      {/* "Run Analysis"/"Open" floating button */}
      <button
        onClick={handleWindowButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="leaflet-control-custom"
        style={{
          position: "fixed",
          top: "270px",
          right: "10px",
          background: isAnalysisLoading ? "#f44336" : "white",
          color: isAnalysisLoading ? "white" : "black",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
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
        {isHovered && (
          <span
            style={{ marginLeft: "5px", fontSize: "13px", fontWeight: "bold" }}
          >
            {windowButtonText}
          </span>
        )}
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
          />
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

      {/* If showLegend is true, display legend box */}
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

    {/* Check if there are any amenities before showing the toggle button */}
{!isSideWindowOpen &&
  overpassData &&
  Object.keys(visibleAmenities).some((category) =>
    overpassData?.elements?.some(
      (el: any) => getCategoryFromTags(el.tags || {}) === category
    )
  ) && (
    <>
      {/* Show/Hide Amenities Toggle Button */}
      {/* Show/Hide Amenities Toggle Button */}
<button
  onClick={() => setShowAmenities((prev) => !prev)}
  style={{
    position: "fixed",
    right: "10px",
    top: "320px",
    background: "white",
    color: "black",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    zIndex: 1000,
    opacity: 0.8,
  }}
>
  <Image
    src={`${basePath}/${showAmenities ? "hidden.svg" : "visible.svg"}`}
    alt={showAmenities ? "Hide Amenities" : "Show Amenities"}
    width={24}
    height={24}
  />
</button>


      {/* Amenity Buttons (Only shown when toggled on) */}
      {showAmenities && (
        <div
          style={{
            position: "fixed",
            top: "365px", // Position below the toggle button
            right: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-end",
            zIndex: 999,
          }}
        >
          {Object.keys(visibleAmenities).map((category) => {
            if (
              overpassData?.elements?.some(
                (el: any) => getCategoryFromTags(el.tags || {}) === category
              )
            ) {
              return (
                <button
                  key={category}
                  onClick={() =>
                    toggleAmenityVisibility(category as AmenityCategory)
                  }
                  style={{
                    background: visibleAmenities[category as AmenityCategory]
                      ? "gray"
                      : "#f76501",
                    color: "white",
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "fit-content",
                    minWidth: "100px",
                  }}
                >
                  {visibleAmenities[category as AmenityCategory]
                    ? "Hide"
                    : "Show"}{" "}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              );
            }
            return null;
          })}
        </div>
      )}
    </>
  )}

      {/* The sidebar */}
      {isSideWindowOpen && (
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

          {/* Title */}
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
                margin: 0,
                padding: 0,
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
              onClick={() => setIsExposureModalOpen(true)}
            />
          </div>

          {/* If area API returned something */}
          {apiResponse ? (
            <div className="mt-6">
              {Object.entries(apiResponse).map(([key, value]) => {
                const readableLabels: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "Population",
                  GHS_BUILT_S_E2020_GLOBE: "Urban Area Extent",
                  cereals_rice: "Cultivated Area Extent",
                };

                const units: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: "",
                  GHS_BUILT_S_E2020_GLOBE: "m²",
                  cereals_rice: "ha",
                };

                const icons: Record<string, string> = {
                  GHS_POP_E2020_GLOBE: `${basePath}/people.svg`,
                  GHS_BUILT_S_E2020_GLOBE: `${basePath}/building.svg`,
                  cereals_rice: `${basePath}/wheat2.svg`,
                };

                if (key === "cereals") return null;

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
                    <strong>{label}</strong>: {String(value)} {unit}
                  </div>
                );
              })}

              {/* Overpass multi-select + button */}
              <div style={{ marginBottom: "15px" }}>
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
                      margin: 0,
                      padding: 0,
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    Critical Infrastructures
                  </h3>
                  <Image
                    src={`${basePath}/infoWhite.svg`}
                    alt="Info"
                    width="16"
                    height="16"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsInfrastructureModalOpen(true)}
                  />
                </div>
                <label
                  style={{
                    color: "white",
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Select Categories:
                </label>

                <Select<CategoryOption, true>
                  isMulti
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={(newValue: MultiValue<CategoryOption>) => {
                    setSelectedCategories([...newValue]);
                  }}
                  styles={reactSelectDarkStyles}
                  placeholder="Choose categories..."
                  closeMenuOnSelect={false}
                />
                <button
                  onClick={handleFetchOverpass}
                  style={{
                    marginTop: "8px",
                    backgroundColor: "#f76501",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {isOverpassLoading ? "Fetching..." : "Fetch Amenities"}
                </button>
                {overpassError && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {overpassError}
                  </div>
                )}
              </div>

              {/* Statistical Analysis section */}
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
                      margin: 0,
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
                    onClick={() => setIsStatModalOpen(true)}
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
                    gap: "10px",
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
                        whiteSpace: "nowrap",
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
                      Storm Surge (m)
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

                  <CoolButton
                    isChartLoading={isChartLoading}
                    onClick={handleGenerate}
                    onCancel={() => {
                      abortController?.abort();
                      setIsChartLoading(false);
                      setAbortController(null);
                    }}
                  />
                </div>

                {/* Chart(s) rendering */}
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
                    />
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
                    // Filter out items where year = 2020
                    const filteredChartData = chartData.filter(
                      (item: any) => item.year !== 2020
                    );

                    let labels: string[] = [];
                    let popValues: number[] = [];
                    let urbanValues: number[] = [];
                    let cerealsValues: number[] = [];

                    filteredChartData.forEach((item: any) => {
                      let labelValue = "";

                      if (displayedOption === "ssp") {
                        labelValue = item.ssp;
                      } else if (displayedOption === "storm") {
                        // Convert "0_0" => "0", "0_5" => "0.5"
                        labelValue = item.storm_surge
                          .replace("_", ".")
                          .replace(/\.0$/, "");
                      } else if (displayedOption === "years") {
                        labelValue = String(item.year);
                      }

                      labels.push(labelValue);
                      popValues.push(item.result.GHS_POP_E2020_GLOBE);
                      urbanValues.push(item.result.GHS_BUILT_S_E2020_GLOBE);
                      cerealsValues.push(item.result.cereals_rice);
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
                        {/* Population Chart */}
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

                        {/* Urban Chart */}
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

                        {/* Cereals Chart */}
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
      )}

      {/* Modals */}
      {isExposureModalOpen && (
        <Modal onClose={() => setIsExposureModalOpen(false)}>
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
            <p>
              The exposure assessment is generated after drawing an area of
              interest on the map using rectangle/polygon buttons the area of
              interest. The values for population and urban area exposure are
              derived from the Copernicus Global Human Settlement products for
              population and built-up surface areas. The values for affected
              cultivated areas are derived from the WorldCereal product from
              ESA, and they include second maize, spring cereal and winter
              cereal.
            </p>
          </div>
        </Modal>
      )}

      {isStatModalOpen && (
        <Modal onClose={() => setIsStatModalOpen(false)}>
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
            <p>
              The statistical analysis function allows to generate an impact
              assessment overview for the area of interest and therefore
              investigate the changes over time as well as in terms of SSP and
              increasing storm surge heights
            </p>
          </div>
        </Modal>
      )}
      {isInfrastructureModalOpen && (
        <Modal onClose={() => setIsInfrastructureModalOpen(false)}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <h3 style={{ marginTop: 0, fontWeight: "bold" }}>
              Critical Infrastructures
            </h3>
            <p>
              The tool connects to Open Street Map and retrieves information
              about critical infrastructures that are at risk of potential
              inundation, which can be visualized directly on the map. Four main
              categories of critical infrastructures are included:
            </p>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Education (schools, universities, etc.)</li>
              <li>
                Emergency Response (ambulance stations, fire stations, etc.)
              </li>
              <li>Energy Systems (power plants, storage tanks, etc.)</li>
              <li>Healthcare (hospitals, clinics, etc.)</li>
            </ul>

            {/* Legend */}
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "10px" }}>Legend:</h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "blue",
                      display: "inline-block",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span>Energy Systems</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "red",
                      display: "inline-block",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span>Emergency Response</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "purple",
                      display: "inline-block",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span>Education</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "green",
                      display: "inline-block",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span>Healthcare</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Map;
