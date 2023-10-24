import { useEffect, useMemo } from "react";
import { useDebounceCallback } from "@react-hook/debounce";

interface ViewportParams {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

const getURLParams = (paramName: string, defaultParam: string): string => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get(paramName)) {
    return searchParams.get(paramName) || defaultParam;
  } else {
    return defaultParam;
  }
};

const getViewportParams = (initialViewport: ViewportParams): ViewportParams => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("lat") && searchParams.get("lon")) {
    const latitude = parseFloat(searchParams.get("lat") || "0");
    const longitude = parseFloat(searchParams.get("lon") || "0");
    const zoom = parseFloat(searchParams.get("zoom") || "0");
    const bearing = parseFloat(searchParams.get("bearing") || "0");
    const pitch = parseFloat(searchParams.get("pitch") || "0");
    return { latitude, longitude, zoom, bearing, pitch };
  } else {
    return initialViewport;
  }
};

const setViewportParams = (viewportParams: ViewportParams) => {
  console.log("Called")
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("lat", viewportParams.latitude.toString());
  searchParams.set("lon", viewportParams.longitude.toString());
  searchParams.set("zoom", viewportParams.zoom.toString());
  searchParams.set("bearing", viewportParams.bearing.toString());
  searchParams.set("pitch", viewportParams.pitch.toString());
  const newSearch = searchParams.toString();
  const newPath = `${window.location.pathname}?${newSearch}`;
  window.history.replaceState(null, "", newPath);
}

export const useViewportPermalink = (defaultViewport: ViewportParams) => {
  const debouncedSetViewportParams = useDebounceCallback(setViewportParams, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialViewport = useMemo(
    () => getViewportParams(defaultViewport),
    [defaultViewport]
  );

  const useUpdateViewport = (viewportParams: ViewportParams) => {
    useEffect(() => {
      debouncedSetViewportParams(viewportParams);
    }, [viewportParams]);
  };

  return { initialViewport, useUpdateViewport };
};

export const useLayerPermalink = (defaultLayer: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialLayer = useMemo(
    () => getURLParams("layer", defaultLayer),
    [defaultLayer]
  );
  
  const useUpdateLayer = (layer: string) => {
    useEffect(() => {  
      if (layer) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("layer", layer);
        const newSearch = searchParams.toString();
        const newPath = `${window.location.pathname}?${newSearch}`;
        window.history.replaceState(null, "", newPath);
      }
    }, [layer]);
  };

  return { initialLayer, useUpdateLayer };
};

export const useSubgroupPermalink = (defaultSubgroup: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSubgroup = useMemo(
    () => getURLParams("subgroup", defaultSubgroup),
    [defaultSubgroup]
  );

  const useUpdateSubgroup = (subgroup: string) => {
    useEffect(() => {    
      if (subgroup) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("subgroup", subgroup);
        const newSearch = searchParams.toString();
        const newPath = `${window.location.pathname}?${newSearch}`;
        window.history.replaceState(null, "", newPath);
      }
    }, [subgroup]);
  };

  return { initialSubgroup, useUpdateSubgroup };
};

interface PermalinkParams {
  defaultViewport: ViewportParams;
  defaultLayer: string;
  defaultSubgroup: string;
}

interface UseUpdatePermalink {
  viewport: ViewportParams;
  layerGroup: string;
  subgroup: string;
}

export const usePermalinks = ({
  defaultViewport,
  defaultLayer,
  defaultSubgroup,
}: PermalinkParams) => {
  const viewportPermalink = useViewportPermalink(defaultViewport);
  const layerPermalink = useLayerPermalink(defaultLayer);
  const subgroupPermalink = useSubgroupPermalink(defaultSubgroup);

  const useUpdatePermalink = ({
    viewport,
    layerGroup,
    subgroup,
  }: UseUpdatePermalink) => {
    viewportPermalink.useUpdateViewport(viewport);
    layerPermalink.useUpdateLayer(layerGroup);
    subgroupPermalink.useUpdateSubgroup(subgroup);
  };
  
  const initialStates = {
    viewport: viewportPermalink.initialViewport,
    layer: layerPermalink.initialLayer,
    subgroup: subgroupPermalink.initialSubgroup,
  };

  return [initialStates, useUpdatePermalink];
};
