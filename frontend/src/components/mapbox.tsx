import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // might have transpiling issues
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import GeoJsonList from "./geoJsonList";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWR1YXJkZmF1bCIsImEiOiJjbHpnZDNiNmwwZTRjMmpweXE3bnNkdnc2In0.UtdovmQiJH8EcCm2HwqYAQ";

var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
});

function MapBox() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(174.7);
  const [lat, setLat] = useState(-36.9);
  const [zoom, setZoom] = useState(9);

  const [geoJsonList, setGeoJsonList] = useState<any>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // @ts-ignore
    map.current.addControl(draw);

    map.current.on("move", () => {
      if (map.current) {
        setLng(Number(map.current.getCenter().lng.toFixed(4)));
        setLat(Number(map.current.getCenter().lat.toFixed(4)));
        setZoom(Number(map.current.getZoom().toFixed(2)));
      }
    });
    map.current.on("load", () => {
      map.current?.resize();
    });

    // @ts-ignore
    map.current.on("draw.create", updateArea); // @ts-ignore
    map.current.on("draw.update", updateArea); // @ts-ignore
    map.current.on("draw.delete", updateArea);

    function updateArea(e: any) {
      const data = draw.getAll();
      setGeoJsonList(data);
    }
  });

  function listClickHandler(id: any) {
    const data = draw.get(id);
    if (data?.geometry?.type === "Point") {
      const coordinates = data.geometry.coordinates;
      map.current?.flyTo({
        center: [coordinates[0], coordinates[1]],
        zoom: 14,
      });
    } else if (data?.geometry?.type === "Polygon") {
      const coordinates = data.geometry.coordinates;
      const bbox = turf.bbox(data) as [number, number, number, number];
      map.current?.fitBounds(bbox, { padding: 100, duration: 1000 });
    }
  }

  return (
    <>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <div className="draw-tools">
        <GeoJsonList
          geoJsonList={geoJsonList}
          clickHandler={listClickHandler}
        />
      </div>
    </>
  );
}

export default MapBox;
