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
