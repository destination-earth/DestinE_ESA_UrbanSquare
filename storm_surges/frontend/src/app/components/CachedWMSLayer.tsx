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
  params,
  onLoading,
  onLoad,
}: CachedWMSLayerProps) => {
  const map = useMap();
  const currentLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const previousLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Create a stable reference for the layer options
  const layerOptionsRef = useRef({
    layers,
    styles,
    format,
    transparent,
    version,
    opacity,
    ...params,
    updateWhenIdle: false,
    updateWhenZooming: true,
    keepBuffer: 8,
    updateInterval: 0,
  });

  useEffect(() => {
    // Update the options reference when props change
    layerOptionsRef.current = {
      layers,
      styles,
      format,
      transparent,
      version,
      opacity,
      ...params,
      updateWhenIdle: false,
      updateWhenZooming: true,
      keepBuffer: 8,
      updateInterval: 0,
    };
  }, [layers, styles, format, transparent, version, opacity, params]);

  useEffect(() => {
    let isMounted = true;

    const createNewLayer = () => {
      if (!isMounted) return;

      const newLayer = L.tileLayer.wms(url, layerOptionsRef.current);

      // Set up event handlers
      newLayer.on('loading', () => {
        if (isMounted) {
          onLoading?.();
          // Keep the previous layer visible while loading
          if (previousLayerRef.current) {
            previousLayerRef.current.setOpacity(opacity);
          }
        }
      });

      newLayer.on('load', () => {
        if (isMounted) {
          onLoad?.();
          // Fade out the previous layer gradually
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

      // Store the previous layer before adding the new one
      if (currentLayerRef.current) {
        if (previousLayerRef.current) {
          map.removeLayer(previousLayerRef.current);
        }
        previousLayerRef.current = currentLayerRef.current;
      }

      // Add new layer and store reference
      newLayer.addTo(map);
      currentLayerRef.current = newLayer;

      // After initial load, set flag to false
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    };

    createNewLayer();

    // Cleanup function
    return () => {
      isMounted = false;
      // Only remove layers if component is being fully unmounted
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