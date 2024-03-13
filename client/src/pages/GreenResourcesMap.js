import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input, Button, Typography, Checkbox } from "@material-tailwind/react";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


const GreenResourcesMap = () => {
  const mapRef = useRef(null);
  const [postalCode, setPostalCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [radius, setRadius] = useState(5000);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState({
    Free_Green_Spaces: true,
    Paid_Green_Spaces: true,
    Sports: true,
    Water_Activities: true,
    Wildlife: true,
    Bicycle_Rental: true,
  });

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    getUserLocation();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  const mapMarker = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: checked,
    }));
  };

  const addGRMarker = async (lat, lon, tags = {}) => {
    if (!tags.name) return; // if the green resource doesn't have a name, we skip it
  
    const grLatitude = lat;
    const grLongitude = lon;
    const grName = tags.name;
    const grImageUrl = await fetchWikipediaData(tags.name, 'image');
    let grDescription = tags.description ? tags.description : await fetchWikipediaData(tags.name, 'description');
    
    let additionalInfo = ''; //not all green resources will have all the tags, so we build "additionalInfo" dynamically with what they have
    if (tags.email) additionalInfo += `Email: <a href="mailto:${tags.email}">${tags.email}</a><br>`;
    if (tags.opening_hours) additionalInfo += `Opening Hours: ${tags.opening_hours}<br>`;
    if (tags.phone) additionalInfo += `Phone: <a href="tel:${tags.phone}">${tags.phone}</a><br>`;
    if (tags.website) additionalInfo += `Website: <a href="${tags.website}" target="_blank">${tags.website}</a><br>`;
    if(grImageUrl) additionalInfo += `<img src="${grImageUrl}" alt="${grName}" style="max-width: 100%;"><br>`;
    if (tags.wikipedia) {
      const wikipediaUrl = await fetchWikipediaData(tags.wikipedia, 'url');
      additionalInfo += `Wikipedia: <a href="${wikipediaUrl}" target="_blank">Link</a><br>`;
    }

    //this info is presented as a popup in markers

    const popupContent = `
      <h3>${grName}</h3>
      <p>${grDescription}</p>
      ${additionalInfo}
      <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(grLatitude)},${encodeURIComponent(grLongitude)}', '_blank')">Get Directions</button>
      `;

    const marker = L.marker([grLatitude, grLongitude], { icon: mapMarker }).bindPopup(popupContent);
    marker.addTo(mapRef.current); 
  
    setMarkers(prevMarkers => [...prevMarkers, marker]);
  };
  
  const clearMarkers = () => { //this function only clears markers that are already displayed. the ones that haven't loaded yet will not be cleared (bug)
    markers.forEach(marker => marker.remove()); 
    setMarkers([]);
  };

  const getUserLocation = async (useStoredLocation = false) => {
    if (useStoredLocation && currentUserLocation) { // If the user's location is already stored, use it
      const { latitude, longitude } = currentUserLocation;
      mapRef.current.setView([latitude, longitude], 13);
      // Add a marker for the user's location
      L.marker([latitude, longitude], { icon: mapMarker }).addTo(mapRef.current);
      await searchGRNearby(latitude, longitude);
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentUserLocation({ latitude, longitude });
          mapRef.current.setView([latitude, longitude], 13);
          L.marker([latitude, longitude], { icon: mapMarker }).addTo(mapRef.current);
          await searchGRNearby(latitude, longitude);
        },
        (error) => {
          alert('Unable to retrieve your location. Please enter your city or postal code.');
        }, {
          enableHighAccuracy: true, // without this it's not very accurate
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Unable to retrieve your location. Please enter your city or postal code.');
    }
  };

  const searchGRNearby = async (latitude, longitude) => {
    const searchRadius = parseInt(radius, 10) || 5000;
    clearMarkers(); // Clear existing markers before adding new ones.
    try {
      const filterString = applyFilters(searchRadius, latitude, longitude);
          if (!filterString) {
            return;
        }

        const url = `https://overpass-api.de/api/interpreter?data=[out:json];(${filterString});out center;`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
          data.elements.forEach(element => { //elements can be "ways" or "nodes". Ways are areas, and nodes are points. I use the center point of each way for the marker instead of using the whole area.
                if (element.type === "way" && element.center) {
                    addGRMarker(element.center.lat, element.center.lon, element.tags);
                } else if (element.type === "node") {
                    addGRMarker(element.lat, element.lon, element.tags);
                }
            });
        } else {
            alert('No Green Resources found nearby.');
        }
    } catch (error) {
        alert('An error occurred while fetching Green Resources.');
    }
  };
  
  const search = async () => { // this function is called when the user clicks the "Search" button
    clearMarkers();

    if (!postalCode && !cityName && currentUserLocation) { //we search based on the current location if the user didn't enter a postal code or city name
      getUserLocation(true);
      return;
    } else if (!postalCode && !cityName) { // called to get the user's location when they didn't enter a postal code or city name and we don't have their location
      getUserLocation();
      return;
    }

    let searchQuery = postalCode ? `postalcode=${postalCode}&country=Canada` : `city=${cityName}&country=Canada`;

    try {
      const url = `https://nominatim.openstreetmap.org/search?${searchQuery}&format=json`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const {lat, lon} = data[0];
        mapRef.current.setView([lat, lon], 13);
        L.marker([lat, lon], { icon: mapMarker }).addTo(mapRef.current);
        searchGRNearby(lat, lon);
      } else {
        alert('No coordinates found for the provided postal code or city name.');
      }
    } catch (error) {
      alert('An error occurred while fetching coordinates.');
    }
  };

  // We get various data from Wikipedia based on the place name and the type of data we want
  const fetchWikipediaData = async (placeName, dataType) => {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
      const response = await fetch(url);
      const data = await response.json();
  
      switch (dataType) {
        case 'description':
          // Check if the description says "may refer to" and handle it accordingly
          if (data.extract && data.extract.includes('may refer to')) {
            return 'Description not available.';
          }
          return data.extract ? data.extract : 'Description not available.';
  
        case 'image':
          return data.thumbnail ? data.thumbnail.source : 'https://easydrawingguides.com/wp-content/uploads/2021/04/how-to-draw-a-park-featured-image-1200.png';
  
        case 'url':
          return data.content_urls ? data.content_urls.desktop.page : '';
  
        default:
          return null;
      }
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      // Provide default values based on dataType
      switch (dataType) {
        case 'description':
          return 'Description not available.';
        case 'image':
          return 'https://easydrawingguides.com/wp-content/uploads/2021/04/how-to-draw-a-park-featured-image-1200.png';
        case 'url':
          return '';
        default:
          return null;
      }
    }
  };

  //we build the query string based on the filters that are active
  function applyFilters(radius, latitude, longitude) {
    let queryParts = [];
  
    const filterQueries = {
      'Free_Green_Spaces': `node[leisure~"park|nature_reserve|garden|recreation_ground"](around:${radius},${latitude},${longitude});way[leisure~"park|nature_reserve|garden|recreation_ground"](around:${radius},${latitude},${longitude});`,
      'Paid_Green_Spaces': `node[leisure~"park|nature_reserve|garden|recreation_ground"][fee~"yes|donation"](around:${radius},${latitude},${longitude});way[leisure~"park|nature_reserve|garden|recreation_ground"][fee~"yes|donation"](around:${radius},${latitude},${longitude});`,
      'Sports': `node[sport~"archery|athletics|baseball|basketball|beachvolleyball|climbing|cricket|cycling|equestrian|fencing|golf|hiking|ice_hockey|judo|kayaking|kitesurfing|running|sailing|skateboard|soccer|surfing|swimming|table_tennis|tennis|volleyball"](around:${radius},${latitude},${longitude});`,
      'Water_Activities': `node[leisure~"swimming_area|water_park"](around:${radius},${latitude},${longitude});way[water~"river|lake|pond|canal"](around:${radius},${latitude},${longitude});`,
      'Wildlife': `node[attraction="zoo|animal"](around:${radius},${latitude},${longitude});node[leisure="bird_hide"](around:${radius},${latitude},${longitude});`,
      'Bicycle_Rental': `node[amenity="bicycle_rental"](around:${radius},${latitude},${longitude});`,
    };
  
    // Loop through the filters state to determine which filters are active and append the corresponding query part
    Object.entries(filters).forEach(([key, isActive]) => {
      if (isActive && filterQueries[key]) {
        queryParts.push(filterQueries[key]);
      }
    });
  
    return queryParts.length > 0 ? queryParts.join('') : '';
  }

  return (
    <div className="ml-[100px] flex">
      <div id="map" style={{ height: "800px", width: "1100px" }} className="flex-initial"></div>
      
      <div className="flex-1 p-4">
        <div className="mb-4">
          <Typography variant="paragraph">Postal Code:</Typography>
          <Input
            size="sm"
            className=" !border-rich-black focus:!border-t-dark-moss-green"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Typography variant="paragraph">City:</Typography>
          <Input
            size="sm"
            className=" !border-rich-black focus:!border-t-dark-moss-green"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Typography variant="paragraph">Radius:</Typography>
          <Input
            size="sm"
            placeholder="5000"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>

        <div className="mb-4">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="flex items-center mb-2">
              <Checkbox
                id={key}
                checked={value}
                onChange={handleCheckboxChange}
                color="green"
                defaultChecked={value}
                label={key.split('_').join(' ')}
                className="!border-rich-black focus:!border-t-dark-moss-green rounded"              />
            </div>
          ))}
        </div>
        <Button size="md" variant="filled" rounded={true} block={false} onClick={search}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default GreenResourcesMap;
