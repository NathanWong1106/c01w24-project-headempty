import { fetchWikipediaData } from './apiWikipedia';

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          (error) => {
            reject('Unable to retrieve your location.');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        reject('Geolocation is not supported by your browser.');
      }
    });
  };
  
  // Function for searching nearby green resources based on the provided filters and user's location
export const searchGRNearby = async ({ latitude, longitude, radius, filters }) => {
  
  const query = buildFilterQuery(radius, latitude, longitude, filters);
  
  if (!query) return [];

  const url = `https://overpass-api.de/api/interpreter?data=[out:json];(${query});out center;`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const markers = await Promise.all(data.elements.map(async (element) => {          
        const lat = element.type === "way" && element.center ? element.center.lat : element.lat;
        const lon = element.type === "way" && element.center ? element.center.lon : element.lon;
        const tags = element.tags;

        if(!tags.name) return null;
      
        const grName = tags.name;
        const grImageUrl = await fetchWikipediaData(tags.name, 'image');
        let grDescription = tags.description ? tags.description : await fetchWikipediaData(tags.name, 'description');
        let additionalInfo = '';

        if (tags.email) additionalInfo += `Email: <a href="mailto:${tags.email}">${tags.email}</a><br>`;
        if (tags.opening_hours) additionalInfo += `Opening Hours: ${tags.opening_hours}<br>`;
        if (tags.phone) additionalInfo += `Phone: <a href="tel:${tags.phone}">${tags.phone}</a><br>`;
        if (tags.website) additionalInfo += `Website: <a href="${tags.website}" target="_blank">${tags.website}</a><br>`;
        if (grImageUrl) additionalInfo += `<img src="${grImageUrl}" alt="${grName}" style="max-width: 100%;"><br>`;
        if (tags.wikipedia) {
            const wikipediaUrl = tags.wikipedia;
            additionalInfo += `Wikipedia: <a href="https://en.wikipedia.org/wiki/${wikipediaUrl}" target="_blank">Link</a><br>`;
        }

        // Assemble the popup content
        const popupContent = `
            <h3>${grName}</h3>
            <p>${grDescription}</p>
            ${additionalInfo}
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat)},${encodeURIComponent(lon)}', '_blank')">Get Directions</button>
            `;

        return { lat, lon, popupContent };
    }));

    if (markers.length === 0) {
        alert('No green resources found in the area.');
    }


    return markers.filter(marker => marker !== null); // Filter out any nulls from skipped markers
  } catch (error) {
      alert('An error occurred while fetching Green Resources.');
      return [];
  }



};

export const buildFilterQuery = (radius, latitude, longitude, filters) => {
  const filterQueries = {
    'Free_Green_Spaces': `node[leisure~"park|nature_reserve|garden|recreation_ground"](around:${radius},${latitude},${longitude});way[leisure~"park|nature_reserve|garden|recreation_ground"](around:${radius},${latitude},${longitude});`,
    'Paid_Green_Spaces': `node[leisure~"park|nature_reserve|garden|recreation_ground"][fee~"yes|donation"](around:${radius},${latitude},${longitude});way[leisure~"park|nature_reserve|garden|recreation_ground"][fee~"yes|donation"](around:${radius},${latitude},${longitude});`,
    'Sports': `node[sport~"archery|athletics|baseball|basketball|beachvolleyball|climbing|cricket|cycling|equestrian|fencing|golf|hiking|ice_hockey|judo|kayaking|kitesurfing|running|sailing|skateboard|soccer|surfing|swimming|table_tennis|tennis|volleyball"](around:${radius},${latitude},${longitude});`,
    'Water_Activities': `node[leisure~"swimming_area|water_park"](around:${radius},${latitude},${longitude});way[water~"river|lake|pond|canal"](around:${radius},${latitude},${longitude});`,
    'Wildlife': `node[attraction="zoo|animal"](around:${radius},${latitude},${longitude});node[leisure="bird_hide"](around:${radius},${latitude},${longitude});`,
    'Bicycle_Rental': `node[amenity="bicycle_rental"](around:${radius},${latitude},${longitude});`,
  };

  let queryParts = [];
  Object.entries(filters).forEach(([key, isActive]) => {
    if (isActive && filterQueries[key]) {
      queryParts.push(filterQueries[key]);
    }
  });

  return queryParts.length > 0 ? queryParts.join('') : '';
};
