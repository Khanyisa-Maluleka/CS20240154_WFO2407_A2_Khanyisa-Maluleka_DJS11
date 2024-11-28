const BASE_URL = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch podcast previews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching previews:', error);
    return [];
  }
};

export const fetchShowDetails = async (showId) => {
  try {
    const response = await fetch(`${BASE_URL}/id/${showId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch show details for ID: ${showId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching show details:', error);
    return null;
  }
};

export const fetchGenre = async (genreId) => {
  try {
    const response = await fetch(`${BASE_URL}/genre/${genreId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch genre with ID: ${genreId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching genre:', error);
    return null;
  }
};