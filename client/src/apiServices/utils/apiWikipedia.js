export const fetchWikipediaData = async (placeName, dataType) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
    const response = await fetch(url);
    const data = await response.json();

    switch (dataType) {
      case 'description':
        if (data.extract && data.extract.includes('may refer to')) {
          return 'Description not available.';
        }
        return data.extract ? data.extract : 'Description not available.';

      case 'image':
        return data.thumbnail ? data.thumbnail.source : null;
  
      default:
        return null;
    }
  } catch (error) {
    switch (dataType) {
      case 'description':
        return 'Description not available.';
      case 'image':
          return 'https://easydrawingguides.com/wp-content/uploads/2021/04/how-to-draw-a-park-featured-image-1200.png';        case 'url':
        return '';
      default:
        return null;
    }
  }
};