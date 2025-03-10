import {useEffect, useState} from "react";

function useGeoLocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  function getPosition() {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosition({lat, lng});
        setIsLoading(false);
        console.log({lat, lng})
      });
    } else {
      alert("Sorry, your browser doesn't support location.");
    }
  }
  return {position, isLoading, getPosition};
}

export {useGeoLocation};