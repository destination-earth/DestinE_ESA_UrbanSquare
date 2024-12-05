import { useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface CachedWMSLayerProps {
  url: string;
  layers: string;
  styles: string;
  format: string;
  transparent: boolean;
  version: string;
  opacity: number;
  crs?: L.CRS; // Optional CRS property
  params: {
    time: string;
    bbox: string;
    token: string;
    ssp: string | null;
    confidence: string;
    stormSurge: string;
  };
  onLoading?: () => void;
  onLoad?: () => void;
}

const CachedWMSLayer = ({
  url,
  layers,
  styles,
  format,
  transparent,
  version,
  opacity,
  crs,
  params,
  onLoading,
  onLoad,
}: CachedWMSLayerProps) => {
  const map = useMap();
  const currentLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const previousLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const layerOptionsRef = useRef({
    layers,
    styles,
    format,
    transparent,
    version,
    opacity,
    crs, // Include CRS here
    ...params,
    updateWhenIdle: false,
    updateWhenZooming: true,
    keepBuffer: 8,
    updateInterval: 0,
  });

  useEffect(() => {
    layerOptionsRef.current = {
      layers,
      styles,
      format,
      transparent,
      version,
      opacity,
      crs, // Update CRS
      ...params,
      updateWhenIdle: false,
      updateWhenZooming: true,
      keepBuffer: 8,
      updateInterval: 0,
    };
  }, [layers, styles, format, transparent, version, opacity, crs, params]);

  useEffect(() => {
    let isMounted = true;

    const createNewLayer = () => {
      if (!isMounted) return;

      const { crs } = layerOptionsRef.current; // Retrieve CRS from options

      const newLayer = L.tileLayer.wms(url, {
        ...layerOptionsRef.current,
        ...(crs && { crs }), // Include CRS only if defined
      });

      // Set up event handlers
      newLayer.on("loading", () => {
        if (isMounted) {
          onLoading?.();
          if (previousLayerRef.current) {
            previousLayerRef.current.setOpacity(opacity);
          }
        }
      });

      newLayer.on("load", () => {
        if (isMounted) {
          onLoad?.();
          if (previousLayerRef.current) {
            const fadeOut = (currentOpacity: number) => {
              if (currentOpacity > 0 && isMounted && previousLayerRef.current) {
                previousLayerRef.current.setOpacity(currentOpacity);
                setTimeout(() => fadeOut(currentOpacity - 0.1), 50);
              } else if (previousLayerRef.current && isMounted) {
                map.removeLayer(previousLayerRef.current);
                previousLayerRef.current = null;
              }
            };
            fadeOut(opacity);
          }
        }
      });

      // Replace previous layer
      if (currentLayerRef.current) {
        if (previousLayerRef.current) {
          map.removeLayer(previousLayerRef.current);
        }
        previousLayerRef.current = currentLayerRef.current;
      }

      // Add new layer and store reference
      newLayer.addTo(map);
      currentLayerRef.current = newLayer;

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    };

    createNewLayer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (!isInitialLoad) {
        if (currentLayerRef.current) {
          map.removeLayer(currentLayerRef.current);
          currentLayerRef.current = null;
        }
        if (previousLayerRef.current) {
          map.removeLayer(previousLayerRef.current);
          previousLayerRef.current = null;
        }
      }
    };
  }, [map, url, isInitialLoad]);

  return null;
};

export default CachedWMSLayer;
