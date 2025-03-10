import styles from "./Map.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from "react-leaflet"
import {useEffect, useState} from "react";
import {useCities} from "../contexts/CitiesContext.jsx";
import {useGeoLocation} from "../hooks/useGeoLocation.js";
import Button from "./Button.jsx";
import useUrlPosition from "../hooks/useUrlPosition.js";

function Map() {
  const {cities} = useCities();
  const [mapPosition, setMapPosition] = useState([18.8909312, 77.6404992]);
  const {position: geoLocationPosition, isLoading: isLoadingPosition, getPosition} = useGeoLocation();
  const {lat, lng} = useUrlPosition();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => <Marker position={[city.position.lat, city.position.lng]} key={city.cityName}>
          <Popup>
            <span>{city.emoji}</span> <span>{city.cityName}</span>
          </Popup>
        </Marker>)}
        <ChangeCenter position={mapPosition}/>
        <DetectClick/>
        <UserPosition geoLocationPosition={geoLocationPosition}/>
      </MapContainer>
      {!geoLocationPosition &&
        <Button type="position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Get my location"}</Button>
      }
    </div>
  );
}

function ChangeCenter({position}) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng])
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  });
  // return null;
  // return (
  //   <Marker position={position}>
  //     <Popup>You are here</Popup>
  //   </Marker>
  // )
}

function UserPosition({geoLocationPosition}) {
  if(!geoLocationPosition) return null;
  return (
    <Marker position={geoLocationPosition}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export default Map;