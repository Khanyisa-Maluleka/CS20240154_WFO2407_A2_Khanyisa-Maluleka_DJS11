  export const fetchShowPreviews = async () => {
  try {
    const response = await fetch("https://podcast-api.netlify.app");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch show previews:", error);
    throw error;
  }
};

export const fetchShowGenreData = async (genreId) => {
  try{
    const response = await fetch(`https://podcast-api.netlify.app/genre/${genreId}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch data for show genres:", error)
    throw error;
  }
  }

  export const fetchShowDetails = async (showId) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Could not fetch show details for ID ${showId}:`, error);
      throw error;
    }
  };
