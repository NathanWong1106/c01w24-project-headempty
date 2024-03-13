import React, { useState, useEffect } from 'react';
import MapDisplay from '../components/MapDisplay';
import SearchControls from '../components/SearchControls.js';
import { getUserLocation, searchGRNearby } from '../apiServices/utils/locationUtilities';

const GreenResourcesMapPage = () => {
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState({
    Free_Green_Spaces: true,
    Paid_Green_Spaces: true,
    Sports: true,
    Water_Activities: true,
    Wildlife: true,
    Bicycle_Rental: true,
  });

  // Initialize user location
  useEffect(() => {
    getUserLocation().then(location => {
      if (location) {
        setCurrentUserLocation(location);
        setMapCenter([location.latitude, location.longitude]);
      }
    }).catch(error => {
      alert('Unable to retrieve your location. Please enter your city or postal code.');
    });
  }, []);

  useEffect(() => {
    if (currentUserLocation) {
      onSearch({
        radius: 1500,
        latitude: currentUserLocation.latitude,
        longitude: currentUserLocation.longitude,
      });
    }
  }, [currentUserLocation]); 

  const onSearch = async ({ postalCode, cityName, radius, latitude, longitude }) => {  
    
    setMarkers([]);

    let lat, lon;

    // First, check if both postalCode and cityName are not provided or are empty strings
    if ((!postalCode && !cityName) || (postalCode === "" && cityName === "")) {
      if (currentUserLocation) {
        lat = currentUserLocation.latitude;
        lon = currentUserLocation.longitude;
      } else {
        alert('Please provide a location.');
        return; 
      }
    } else {
      const searchQuery = postalCode ? `postalcode=${postalCode}&country=Canada` : `city=${cityName}&country=Canada`;
      try {
        const url = `https://nominatim.openstreetmap.org/search?${searchQuery}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
        } else {
          alert('No coordinates found for the provided postal code or city name.');
          return;
        }
      } catch (error) {
        alert('An error occurred while fetching coordinates.');
        return;
      }
    }
  
    if (lat !== undefined && lon !== undefined) {
      const newMarkers = await searchGRNearby({ latitude: lat, longitude: lon, radius, filters });
      setMarkers(newMarkers);
      setMapCenter([lat, lon]);
    } 


  return (
    <div className="ml-[100px] flex">
     <MapDisplay markers={markers} center={mapCenter} currentUserLocation={currentUserLocation} />      
      <SearchControls
        filters={filters}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
  };


return (
  <div className="ml-[100px] flex">
    <MapDisplay markers={markers} center={mapCenter} currentUserLocation={currentUserLocation} />      
    <SearchControls
      filters={filters}
      onSearch={onSearch}
      onFilterChange={onFilterChange}
    />
  </div>
);

};

export default GreenResourcesMapPage;