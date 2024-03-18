import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const mapMarker = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapDisplay = ({ markers, center, currentUserLocation }) => {
  const mapRef = useRef(null);
  const userLocationMarkerRef = useRef(null);
  const markersRef = useRef([]);


  useEffect(() => {

    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center,
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    
    } else {
        mapRef.current.setView(center, 13);
    }

  }, [center]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers as soon as they are found
    markers.forEach(addMarker);
  }, [markers]);

  useEffect(() => {
    // Update or set the user location marker
    if (currentUserLocation && mapRef.current) {
      if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove(); 
    }
    const newUserLocationMarker = L.marker([currentUserLocation.latitude, currentUserLocation.longitude], { icon: mapMarker }).bindPopup('You are here');
    newUserLocationMarker.addTo(mapRef.current);
    userLocationMarkerRef.current = newUserLocationMarker; 
  }
}, [currentUserLocation, mapRef.current]);

  // Function to add a single marker
  const addMarker = (markerData) => {
    if (mapRef.current) {
      const marker = L.marker([markerData.lat, markerData.lon], { icon: mapMarker }).bindPopup(markerData.popupContent);
      marker.addTo(mapRef.current);
      markersRef.current.push(marker);
    }
  };

  return <div id="map" className="w-full h-screen"></div>;
};

export default MapDisplay;