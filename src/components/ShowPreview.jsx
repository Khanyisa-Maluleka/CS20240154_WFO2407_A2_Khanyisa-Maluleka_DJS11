import { useState, useEffect } from 'react';

const ShowPreview = () => {
  const [showPreviews, setShowPreviews] = useState([]);

  useEffect(() => {
    const fetchShowPreviews = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        setShowPreviews(data);
      } catch (error) {
        console.error('Error fetching show previews:', error);
      }
    };
    fetchShowPreviews();
  }, []);

  return (
    <div>
      {showPreviews.map((show) => (
        <div key={show.id}>
          <h2>{show.title}</h2>
          <p>{show.description}</p>
          <img src={show.thumbnail} alt={show.title} />
        </div>
      ))}
    </div>
  );
};

export default ShowPreview;