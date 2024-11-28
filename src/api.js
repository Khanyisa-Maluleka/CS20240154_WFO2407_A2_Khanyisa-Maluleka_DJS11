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

export const fetchShowGenreData = async () => {
  try{
    const response = await fetch("https://podcast-api.netlify.app/genre/<ID>");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch data for show genres:", error)
    throw error;
  }
  }
