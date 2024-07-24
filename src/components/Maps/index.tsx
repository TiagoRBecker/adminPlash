"use client"
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Url = {
  googleMapsUrl: string;
};

const MapContainer = ({ googleMapsUrl }: Url) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const mapOptions = {
        center: {
          lat: 0,
          lng: 0,
        },
        zoom: 4,
      };

      const matches = googleMapsUrl.match(/\/@([-0-9.]+),([-0-9.]+)/);
      if (matches && matches.length >= 3) {
        mapOptions.center.lat = parseFloat(matches[1]);
        mapOptions.center.lng = parseFloat(matches[2]);
      }

      const { Map } = await loader.importLibrary("maps"); // Carrega a API do Google Maps

      const mapInstance = new Map(mapRef.current, mapOptions); // Cria uma nova instância do mapa

      setMap(mapInstance); // Atualiza o estado com a instância do mapa
    };

    initMap();
  }, [googleMapsUrl]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "400px" }}>
      {map ? (
        <p>O mapa está carregando...</p>
      ) : (
        <p>O mapa foi carregado com sucesso!</p>
      )}
    </div>
  );
};

export default MapContainer;
