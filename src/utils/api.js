const apiData = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  try {
    const response = await fetch(apiData);
    if (!response.ok) throw new Error('Failed to fetch previews');
    return await response.json();
  } catch (error) {
    console.error('Error fetching previews:', error);
    return [];
  }
};

export const fetchShowDetails = async (id) => {
  try {
    const response = await fetch(`${apiData}/id/${id}`);
    if (!response.ok) throw new Error('Failed to fetch show details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching show details:', error);
    return null;
  }
};

export const fetchGenre = async (genreId) => {
  try {
    const response = await fetch(`${apiData}/genre/${genreId}`);
    if (!response.ok) throw new Error('Failed to fetch genre');
    return await response.json();
  } catch (error) {
    console.error('Error fetching genre:', error);
    return null;
  }
};